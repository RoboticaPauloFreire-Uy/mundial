import os
import glob
import json
import re
import shutil
import unicodedata

# Paths
album_dir = r'C:\Users\Admin\Desktop\Album'
figuritas_dir = r'C:\Users\Admin\Desktop\Figuritas'
alumnos_js = os.path.join(album_dir, 'data', 'alumnos.js')
dest_img_dir = os.path.join(album_dir, 'img')

def normalize_string(s):
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    s = re.sub(r'[^a-zA-Z0-9\s]', ' ', s)
    s = re.sub(r'\s+', ' ', s)
    return s.strip().lower()

def get_clean_basename(filepath):
    filename = os.path.basename(filepath)
    while True:
        name_part, ext = os.path.splitext(filename)
        if ext.lower() in ('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'):
            filename = name_part
        else:
            break
    return filename

def normalizar_grupo(grupo):
    texto = grupo.upper()
    texto = texto.replace('Ñ', 'N').replace('AÑOS', 'ANOS')
    replacements = {'Á':'A', 'É':'E', 'Í':'I', 'Ó':'O', 'Ú':'U'}
    for k, v in replacements.items():
        texto = texto.replace(k, v)
    m = re.search(r'[1-6]', texto)
    grado = m.group(0) if m else ''
    m = re.search(r'[AB]\s*$', texto)
    seccion = m.group(0).strip() if m else ''
    if grado == '5' and 'ANOS' not in texto:
        return '5P' + seccion
    return grado + seccion

with open(alumnos_js, 'r', encoding='utf-8') as f:
    content = f.read()
start_idx = content.find('{')
end_idx = content.rfind('}') + 1
json_str = content[start_idx:end_idx]
data = json.loads(json_str)

adelante_files = {}
atras_files = {}

for root, dirs, files in os.walk(figuritas_dir):
    for file in files:
        if file.lower().endswith(('.png', '.jpg', '.jpeg')):
            filepath = os.path.join(root, file)
            clean_name = get_clean_basename(filepath)
            filename_norm = normalize_string(clean_name)
            
            root_lower = root.lower()
            if 'adelante' in root_lower:
                if filename_norm not in adelante_files:
                    adelante_files[filename_norm] = []
                adelante_files[filename_norm].append(filepath)
            elif 'atras' in root_lower:
                if filename_norm not in atras_files:
                    atras_files[filename_norm] = []
                atras_files[filename_norm].append(filepath)

def file_priority(filepath):
    if 'ia_mexico' not in filepath.lower():
        return 0
    return 1

for k in adelante_files:
    adelante_files[k].sort(key=file_priority)
for k in atras_files:
    atras_files[k].sort(key=file_priority)

faltantes = []

for a in data['alumnos']:
    nombre_norm = normalize_string(a['nombre'])
    grupo_norm = normalizar_grupo(a['grupo'])
    
    dest_folder = os.path.join(dest_img_dir, grupo_norm)
    os.makedirs(dest_folder, exist_ok=True)
    
    # Check if front image already exists manually in the img folder
    existing_front = glob.glob(os.path.join(dest_folder, f"{a['id']}.*"))
    valid_front = [f for f in existing_front if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    match_adelante = adelante_files.get(nombre_norm)
    match_atras = atras_files.get(nombre_norm)
    
    # Check if back image is present in source folder
    has_back = bool(match_atras)
    
    # Check if front image is present (either manually or in source folder)
    has_front = bool(valid_front) or bool(match_adelante)
    
    if has_front and has_back:
        # Both exist!
        a['tiene_imagen'] = True
        
        if valid_front:
            # Already exists locally, use it
            filename = os.path.basename(valid_front[0])
            a['img'] = f'img/{grupo_norm}/{filename}'
        elif match_adelante:
            # Copy from source folder (ONLY the front image)
            f_adelante = match_adelante[0]
            ext_adelante = os.path.splitext(f_adelante)[1]
            new_f_adelante = a['id'] + ext_adelante
            dest_path_adelante = os.path.join(dest_folder, new_f_adelante)
            shutil.copy2(f_adelante, dest_path_adelante)
            
            a['img'] = f'img/{grupo_norm}/{new_f_adelante}'
    else:
        # Something is missing
        motivo = ""
        if not has_front and not has_back:
            motivo = "Falta ADELANTE y ATRÁS"
        elif not has_front:
            motivo = "Falta ADELANTE"
        elif not has_back:
            motivo = "Falta ATRÁS"
            
        if motivo:
            faltantes.append(f"{a['id']} - {a['nombre']} ({a['grupo']}) -> {motivo}")
            
        a['tiene_imagen'] = False
        
        # If front exists manually but back is missing, keep pointing to it
        if valid_front:
             filename = os.path.basename(valid_front[0])
             a['img'] = f'img/{grupo_norm}/{filename}'

new_content = 'const albumData = ' + json.dumps(data, indent=2, ensure_ascii=False) + ';\n'
with open(alumnos_js, 'w', encoding='utf-8') as f:
    f.write(new_content)

# Update alumnos.json too
with open(os.path.join(album_dir, 'data', 'alumnos.json'), 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

faltantes_path = os.path.join(album_dir, 'faltantes.txt')
with open(faltantes_path, 'w', encoding='utf-8') as f:
    if faltantes:
        f.write('Alumnos con figuritas incompletas o faltantes:\n\n')
        for item in faltantes:
            f.write(item + '\n')
    else:
        f.write('Todas las figuritas (adelante y atrás) fueron encontradas.\n')

print(f'Proceso completado. Incompletos/Faltantes: {len(faltantes)}')

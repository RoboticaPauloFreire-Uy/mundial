import os
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
    return s.strip().lower()

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

# Gather all files
adelante_files = {}
atras_files = {}

for root, dirs, files in os.walk(figuritas_dir):
    for file in files:
        if file.lower().endswith(('.png', '.jpg', '.jpeg')):
            filepath = os.path.join(root, file)
            filename_norm = normalize_string(os.path.splitext(file)[0])
            
            # Identify if it's 'adelante' or 'atras'
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

# Sort files to prefer non-ia folders if multiples exist
for k in adelante_files:
    adelante_files[k].sort(key=file_priority)
for k in atras_files:
    atras_files[k].sort(key=file_priority)

faltantes = []

for a in data['alumnos']:
    nombre_norm = normalize_string(a['nombre'])
    grupo_norm = normalizar_grupo(a['grupo'])
    
    match_adelante = adelante_files.get(nombre_norm)
    match_atras = atras_files.get(nombre_norm)
    
    if match_adelante and match_atras:
        # Both exist
        f_adelante = match_adelante[0]
        f_atras = match_atras[0]
        
        ext_adelante = os.path.splitext(f_adelante)[1]
        ext_atras = os.path.splitext(f_atras)[1]
        
        dest_folder = os.path.join(dest_img_dir, grupo_norm)
        os.makedirs(dest_folder, exist_ok=True)
        
        new_f_adelante = a['id'] + ext_adelante
        new_f_atras = a['id'] + "_atras" + ext_atras
        
        dest_path_adelante = os.path.join(dest_folder, new_f_adelante)
        dest_path_atras = os.path.join(dest_folder, new_f_atras)
        
        shutil.copy2(f_adelante, dest_path_adelante)
        shutil.copy2(f_atras, dest_path_atras)
        
        a['img'] = f'img/{grupo_norm}/{new_f_adelante}'
    else:
        # Missing something
        motivo = ""
        if not match_adelante and not match_atras:
            motivo = "Falta ADELANTE y ATRÁS"
        elif not match_adelante:
            motivo = "Falta ADELANTE"
        elif not match_atras:
            motivo = "Falta ATRÁS"
            
        faltantes.append(f"{a['id']} - {a['nombre']} ({a['grupo']}) -> {motivo}")

new_content = 'const albumData = ' + json.dumps(data, indent=2, ensure_ascii=False) + ';\n'
with open(alumnos_js, 'w', encoding='utf-8') as f:
    f.write(new_content)

faltantes_path = os.path.join(album_dir, 'faltantes.txt')
with open(faltantes_path, 'w', encoding='utf-8') as f:
    if faltantes:
        f.write('Alumnos con figuritas incompletas o faltantes:\n\n')
        for item in faltantes:
            f.write(item + '\n')
    else:
        f.write('Todas las figuritas (adelante y atrás) fueron encontradas.\n')

print(f'Proceso completado. Incompletos/Faltantes: {len(faltantes)}')

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

all_files = []
for root, dirs, files in os.walk(figuritas_dir):
    for file in files:
        if file.lower().endswith(('.png', '.jpg', '.jpeg')):
            all_files.append(os.path.join(root, file))

def file_priority(filepath):
    if 'adelante' in filepath.lower() and 'ia_mexico' not in filepath.lower():
        return 0
    if 'adelante' in filepath.lower():
        return 1
    return 2
all_files.sort(key=file_priority)

faltantes = []
for a in data['alumnos']:
    nombre_norm = normalize_string(a['nombre'])
    grupo_norm = normalizar_grupo(a['grupo'])
    
    match = None
    for f in all_files:
        filename = os.path.splitext(os.path.basename(f))[0]
        if normalize_string(filename) == nombre_norm:
            match = f
            break
            
    if match:
        ext = os.path.splitext(match)[1]
        dest_folder = os.path.join(dest_img_dir, grupo_norm)
        os.makedirs(dest_folder, exist_ok=True)
        
        new_filename = a['id'] + ext
        dest_path = os.path.join(dest_folder, new_filename)
        
        shutil.copy2(match, dest_path)
        
        a['img'] = f'img/{grupo_norm}/{new_filename}'
    else:
        faltantes.append(f"{a['id']} - {a['nombre']} ({a['grupo']})")

new_content = 'const albumData = ' + json.dumps(data, indent=2, ensure_ascii=False) + ';\n'
with open(alumnos_js, 'w', encoding='utf-8') as f:
    f.write(new_content)

faltantes_path = os.path.join(album_dir, 'faltantes.txt')
with open(faltantes_path, 'w', encoding='utf-8') as f:
    if faltantes:
        f.write('Alumnos sin figurita encontrada:\n')
        for item in faltantes:
            f.write(item + '\n')
    else:
        f.write('Todas las figuritas fueron encontradas.\n')

print(f'Proceso completado. Faltantes: {len(faltantes)}')

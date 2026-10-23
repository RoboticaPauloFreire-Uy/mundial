import os
import json
import re
import glob
import unicodedata

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

album_dir = r'C:\Users\Admin\Desktop\Album'
figuritas_dir = r'C:\Users\Admin\Desktop\Figuritas'
alumnos_js = os.path.join(album_dir, 'data', 'alumnos.js')
dest_img_dir = os.path.join(album_dir, 'img')

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

for a in data['alumnos']:
    if 'Villamil' in a['nombre']:
        nombre_norm = normalize_string(a['nombre'])
        grupo_norm = normalizar_grupo(a['grupo'])
        dest_folder = os.path.join(dest_img_dir, grupo_norm)
        existing_front = glob.glob(os.path.join(dest_folder, f"{a['id']}.*"))
        valid_front = [f for f in existing_front if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        match_adelante = adelante_files.get(nombre_norm)
        match_atras = atras_files.get(nombre_norm)
        
        has_back = bool(match_atras)
        has_front = bool(valid_front) or bool(match_adelante)
        
        print('valid_front:', valid_front)
        print('has_front:', has_front)
        print('has_back:', has_back)
        if has_front and has_back:
            print('Condition has_front and has_back is TRUE')
        else:
            print('Condition has_front and has_back is FALSE')

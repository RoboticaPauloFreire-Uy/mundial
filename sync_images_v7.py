import os
import glob
import json
import re
import shutil
import unicodedata
import difflib

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

# Gather all files in Figuritas
adelante_files = {}  # normalized_name -> [filepaths]
alumnos_files = {}   # normalized_name -> [filepaths]
atras_files = {}     # normalized_name -> [filepaths]

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
            elif 'alumnos' in root_lower:
                if filename_norm not in alumnos_files:
                    alumnos_files[filename_norm] = []
                alumnos_files[filename_norm].append(filepath)
            elif 'atras' in root_lower:
                if filename_norm not in atras_files:
                    atras_files[filename_norm] = []
                atras_files[filename_norm].append(filepath)

# Priority sorting
def file_priority(filepath):
    if 'ia_mexico' not in filepath.lower():
        return 0
    return 1

for k in adelante_files:
    adelante_files[k].sort(key=file_priority)

# Fuzzy match helper
def find_best_match(name_norm, files_dict, threshold=0.85):
    # Try exact match first
    if name_norm in files_dict:
        return name_norm, files_dict[name_norm][0]
    
    # Try fuzzy matching
    best_ratio = 0
    best_key = None
    for key in files_dict.keys():
        ratio = difflib.SequenceMatcher(None, name_norm, key).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
            best_key = key
            
    if best_ratio >= threshold:
        return best_key, files_dict[best_key][0]
        
    return None, None

faltantes = []
correctas_copiadas = 0
incorrectas_eliminadas = 0

for a in data['alumnos']:
    nombre_norm = normalize_string(a['nombre'])
    grupo_norm = normalizar_grupo(a['grupo'])
    dest_folder = os.path.join(dest_img_dir, grupo_norm)
    os.makedirs(dest_folder, exist_ok=True)
    
    # Fuzzy match in adelante folder
    matched_key, f_adelante = find_best_match(nombre_norm, adelante_files)
    
    if f_adelante:
        # We found a matching card in 'adelante'
        ext_adelante = os.path.splitext(f_adelante)[1]
        new_f_adelante = a['id'] + ext_adelante
        dest_path_adelante = os.path.join(dest_folder, new_f_adelante)
        
        # Copy to destination (always overwrite to ensure it's the correct front design)
        shutil.copy2(f_adelante, dest_path_adelante)
        a['img'] = f'img/{grupo_norm}/{new_f_adelante}'
        a['tiene_imagen'] = True
        correctas_copiadas += 1
    else:
        # No matching 'adelante' card found
        # Check if they have an image file in the Album destination folder
        existing_files = glob.glob(os.path.join(dest_folder, f"{a['id']}.*"))
        
        is_manual_correct = False
        if existing_files:
            local_file = existing_files[0]
            local_size = os.path.getsize(local_file)
            
            # Let's check if this local file matches the size of their face photo or back design
            # to determine if it is a leftover/incorrect copy.
            _, f_alumno = find_best_match(nombre_norm, alumnos_files)
            _, f_atras = find_best_match(nombre_norm, atras_files)
            
            is_incorrect = False
            if f_alumno and os.path.getsize(f_alumno) == local_size:
                is_incorrect = True
            elif f_atras and os.path.getsize(f_atras) == local_size:
                is_incorrect = True
                
            if is_incorrect:
                # It's a face photo or back photo copied by mistake in the past! Delete it.
                os.remove(local_file)
                incorrectas_eliminadas += 1
            else:
                # It doesn't match any face photo or back photo, so it must be a manual correct copy!
                is_manual_correct = True
                
        if is_manual_correct:
            filename = os.path.basename(existing_files[0])
            a['img'] = f'img/{grupo_norm}/{filename}'
            a['tiene_imagen'] = True
        else:
            # Mark as missing
            a['tiene_imagen'] = False
            # Point to a standard fallback name just in case
            a['img'] = f'img/{grupo_norm}/{a["id"]}.png'
            faltantes.append(f"{a['id']} - {a['nombre']} ({a['grupo']}) -> Falta la tarjeta de ADELANTE")

new_content = 'const albumData = ' + json.dumps(data, indent=2, ensure_ascii=False) + ';\n'
with open(alumnos_js, 'w', encoding='utf-8') as f:
    f.write(new_content)

# Update alumnos.json too
with open(os.path.join(album_dir, 'data', 'alumnos.json'), 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Write faltantes.txt
faltantes_path = os.path.join(album_dir, 'faltantes.txt')
with open(faltantes_path, 'w', encoding='utf-8') as f:
    if faltantes:
        f.write('Alumnos sin tarjeta de ADELANTE encontrada (Faltantes):\n\n')
        for item in faltantes:
            f.write(item + '\n')
    else:
        f.write('Todas las tarjetas de ADELANTE fueron encontradas.\n')

print(f"Sincronización completada:")
print(f"- Tarjetas copiadas/actualizadas: {correctas_copiadas}")
print(f"- Fotos incorrectas (cara/atrás) eliminadas: {incorrectas_eliminadas}")
print(f"- Alumnos faltantes: {len(faltantes)}")

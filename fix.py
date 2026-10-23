import sys

file_path = 'c:/Users/Admin/Desktop/Album/js/app.js'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Let's find the indices exactly
# We want to remove the broken initAlbum and the comments above it.
# It looks like:
# // =========================================
# // CARGA DE DATOS Y RENDERIZADO
# // =========================================
# function initAlbum() {
#     try {
#         const coleccionLocal = JSON.parse(...)
#     }
# }

new_lines = []
skip = False
for i, line in enumerate(lines):
    if line.startswith('// CARGA DE DATOS Y RENDERIZADO') and 'initAlbum' in lines[i+2]:
        # We found the start of an initAlbum block
        # If it's the broken one (doesn't have 'alumnosGlobal' properly mapped)
        if 'alumnosGlobal =' not in ''.join(lines[i:i+15]):
            skip = True
    
    if skip and line.strip() == '}':
        # we reached the end of the broken initAlbum
        skip = False
        continue # skip the closing brace too
        
    if not skip:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

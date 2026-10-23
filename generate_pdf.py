import os
import json
import re
import tempfile
import shutil
from playwright.sync_api import sync_playwright
from pypdf import PdfWriter

# Paths
album_dir = r'C:\Users\Admin\Desktop\Album'
alumnos_js = os.path.join(album_dir, 'data', 'alumnos.js')
output_pdf = os.path.join(album_dir, 'Album_Digital_Interactivo.pdf')

# Flag and country mappings
paises_por_grupo = {
    "5A": {"pais": "Colombia", "bandera": "🇨🇴"},
    "5B": {"pais": "Ecuador", "bandera": "🇪🇨"},
    "1A": {"pais": "México", "bandera": "🇲🇽"},
    "1B": {"pais": "Estados Unidos", "bandera": "🇺🇸"},
    "2A": {"pais": "Portugal", "bandera": "🇵🇹"},
    "2B": {"pais": "Brasil", "bandera": "🇧🇷"},
    "3A": {"pais": "Argentina", "bandera": "🇦🇷"},
    "3B": {"pais": "Paraguay", "bandera": "🇵🇾"},
    "4A": {"pais": "España", "bandera": "🇪🇸"},
    "4B": {"pais": "Panamá", "bandera": "🇵🇦"},
    "5PA": {"pais": "Canadá", "bandera": "🇨🇦"},
    "5PB": {"pais": "Haití", "bandera": "🇭🇹"},
    "6A": {"pais": "Francia", "bandera": "🇫🇷"},
    "6B": {"pais": "Inglaterra", "bandera": "🏴󠁧󠁢󠁥󠁮󠁧󠁿"}
}

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

# Read JS JSON
with open(alumnos_js, 'r', encoding='utf-8') as f:
    content = f.read()
start_idx = content.find('{')
end_idx = content.rfind('}') + 1
json_str = content[start_idx:end_idx]
data = json.loads(json_str)

# Group students
alumnos_por_grupo = {}
for a in data['alumnos']:
    grupo = a['grupo']
    if grupo not in alumnos_por_grupo:
        alumnos_por_grupo[grupo] = []
    alumnos_por_grupo[grupo].append(a)

grupos_ordenados = sorted(alumnos_por_grupo.keys(), key=lambda g: normalizar_grupo(g))

# Temp directory for page PDFs and HTMLs
temp_dir = tempfile.mkdtemp()
temp_pdf_paths = []

logo_path_uri = 'file:///' + os.path.join(album_dir, 'img', 'logo-cpf.jpg').replace('\\', '/')

print(f"Total grupos a procesar: {len(grupos_ordenados)}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    for idx, grupo in enumerate(grupos_ordenados):
        grupo_norm = normalizar_grupo(grupo)
        pais_info = paises_por_grupo.get(grupo_norm, {"pais": "", "bandera": ""})
        alumnos = sorted(alumnos_por_grupo[grupo], key=lambda a: a['nombre'])
        
        # Build HTML for this specific A4 page
        page_html = f"""<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Montserrat:ital,wght@0,700;0,900;1,900&display=swap" rel="stylesheet">
            <style>
                body {{
                    font-family: 'Inter', sans-serif;
                    background-color: #ffffff;
                    margin: 0;
                    padding: 0;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }}
                .page {{
                    width: 210mm;
                    height: 297mm;
                    padding: 15mm;
                    box-sizing: border-box;
                    background-color: #ffffff;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }}
            </style>
        </head>
        <body>
            <div class="page">
                <!-- Header -->
                <div class="flex items-center justify-between border-b-4 border-[#00f0ff] pb-4 bg-slate-900 text-white p-4 rounded-lg">
                    <div class="flex items-center gap-3">
                        <div class="bg-white p-1 rounded-full w-12 h-12 flex items-center justify-center overflow-hidden">
                            <img src="{logo_path_uri}" class="w-full h-full object-contain">
                        </div>
                        <div>
                            <h1 class="text-xs text-[#00f0ff] font-bold uppercase tracking-widest leading-none">Álbum Digital CPF 2026</h1>
                            <h2 class="text-xl font-black italic tracking-tight uppercase" style="font-family: 'Montserrat', sans-serif;">{grupo}</h2>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-2xl">{pais_info['bandera']}</span>
                        <span class="font-bold text-sm tracking-wider uppercase block">{pais_info['pais']}</span>
                    </div>
                </div>

                <!-- Grid -->
                <div class="grid grid-cols-4 gap-3 flex-grow my-4 content-start">
        """

        for al in alumnos:
            has_image = al.get('tiene_imagen', False)
            drive_url = al.get('drive_url', '')
            if not drive_url:
                drive_url = "https://drive.google.com"

            # Resolve local image absolute path for Playwright
            img_rel = al['img'].replace('/', '\\')
            local_img_path = 'file:///' + os.path.join(album_dir, img_rel).replace('\\', '/')

            if has_image:
                page_html += f"""
                <a href="{drive_url}" target="_blank" class="block bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-[#00f0ff] transition-all relative aspect-[3/4] group">
                    <div class="absolute top-1.5 left-1.5 bg-black/60 text-white font-mono text-[9px] px-1.5 py-0.5 rounded z-10">#{al['id']}</div>
                    <img src="{local_img_path}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    <div class="absolute inset-x-0 bottom-0 bg-slate-900/80 text-[#00f0ff] text-[8px] font-black uppercase text-center py-1 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity z-20">Google Drive</div>
                </a>
                """
            else:
                page_html += f"""
                <a href="{drive_url}" target="_blank" class="block bg-slate-50 border-2 border-dashed border-slate-300 hover:border-[#00f0ff] rounded-lg flex flex-col justify-between p-2 relative aspect-[3/4] group transition-all text-slate-400 hover:text-[#00f0ff]">
                    <div class="bg-slate-100 border border-slate-300 text-slate-600 font-mono text-[9px] px-1.5 py-0.5 rounded self-start">#{al['id']}</div>
                    <div class="flex flex-col items-center justify-center flex-grow py-4 opacity-50 group-hover:opacity-100 transition-opacity">
                        <span class="text-lg">➕</span>
                        <span class="text-[8px] uppercase tracking-wider font-bold">Ver Drive</span>
                    </div>
                    <div class="border-t border-slate-200 pt-1 text-center">
                        <h3 class="text-[9px] font-bold uppercase truncate">{al['nombre']}</h3>
                    </div>
                </a>
                """
                
        page_html += f"""
                </div>

                <!-- Footer -->
                <div class="border-t border-slate-200 pt-3 flex justify-between items-center text-slate-400 text-[10px]">
                    <span>COLEGIO PAULO FREIRE</span>
                    <span class="font-bold">CPF ROBÓTICA MUNDIAL 2026</span>
                    <span>Pág. {idx + 1} | Click en las figuritas abre su carpeta de Google Drive</span>
                </div>
            </div>
        </body>
        </html>
        """

        # Save individual group HTML
        temp_html_path = os.path.join(temp_dir, f"temp_{grupo_norm}.html")
        with open(temp_html_path, 'w', encoding='utf-8') as f:
            f.write(page_html)

        # Convert to PDF via Playwright
        temp_pdf_path = os.path.join(temp_dir, f"temp_{grupo_norm}.pdf")
        page.goto('file:///' + temp_html_path.replace('\\', '/'), wait_until="networkidle")
        page.pdf(
            path=temp_pdf_path,
            format="A4",
            print_background=True,
            margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"}
        )
        temp_pdf_paths.append(temp_pdf_path)
        print(f"[{idx+1}/{len(grupos_ordenados)}] Renderizado PDF para: {grupo}")

    browser.close()

# Merge all page PDFs using pypdf.PdfWriter
print("Foliando y uniendo todas las páginas PDF...")
writer = PdfWriter()
for path in temp_pdf_paths:
    writer.append(path)
writer.write(output_pdf)
writer.close()

# Cleanup temp files
try:
    shutil.rmtree(temp_dir)
except Exception as e:
    print(f"Error cleaning up temp directory: {e}")

print(f"¡Proceso completo! PDF generado: {output_pdf}")

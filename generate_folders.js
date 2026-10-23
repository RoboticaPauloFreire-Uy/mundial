const fs = require('fs');
const path = require('path');
const vm = require('vm');

const code = fs.readFileSync('data/alumnos.js', 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const alumnos = sandbox.albumData.alumnos;
const baseDir = path.join('img', 'figuritas', 'mundial');

if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
}

let count = 0;
alumnos.forEach(a => {
    // Normalizar el nombre del grupo para que no tenga espacios raros (ej: "5 años A" -> "5_anos_A")
    const grupoStr = a.grupo.replace(/ñ/g, 'n').replace(/[^a-zA-Z0-9]/g, '_');
    
    // Crear carpeta del grupo y dentro la del alumno
    const dirPath = path.join(baseDir, grupoStr, a.nombre);
    
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        count++;
    }
});

console.log('Se generaron ' + count + ' carpetas de alumnos organizadas por grupo.');

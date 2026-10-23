const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('data/alumnos.js', 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const alumnos = sandbox.albumData.alumnos;

// Extraemos solo el nombre y grupo para hacer el script más liviano
const alumnosSimples = alumnos.map(a => ({
    nombre: a.nombre,
    grupo: a.grupo.replace(/ñ/g, 'n').replace(/[^a-zA-Z0-9 ]/g, '') // limpiar caracteres raros
}));

const scriptContent = `
function generarCarpetasDrive() {
  // Pega aquí el ID de tu carpeta principal
  var folderId = '1ot38RflGwNGaiBFQ2epZB0txxYrE_bVr';
  var rootFolder = DriveApp.getFolderById(folderId);
  
  var alumnosData = ${JSON.stringify(alumnosSimples, null, 2)};
  
  // Objeto para cachear las carpetas de los grupos creadas
  var groupFolders = {};
  
  var count = 0;
  
  for (var i = 0; i < alumnosData.length; i++) {
    var alumno = alumnosData[i];
    var grupo = alumno.grupo;
    var nombre = alumno.nombre;
    
    // Si no existe la carpeta del grupo, la creamos
    if (!groupFolders[grupo]) {
      // Buscar si ya existe para no duplicar
      var existingFolders = rootFolder.getFoldersByName(grupo);
      if (existingFolders.hasNext()) {
        groupFolders[grupo] = existingFolders.next();
      } else {
        groupFolders[grupo] = rootFolder.createFolder(grupo);
      }
    }
    
    var parentFolder = groupFolders[grupo];
    
    // Crear carpeta del alumno
    var existingStudentFolders = parentFolder.getFoldersByName(nombre);
    if (!existingStudentFolders.hasNext()) {
      parentFolder.createFolder(nombre);
      count++;
    }
  }
  
  Logger.log('Se generaron ' + count + ' carpetas nuevas en tu Google Drive.');
}
`;

fs.writeFileSync('ScriptParaGoogleDrive.js', scriptContent, 'utf8');
console.log('Script generado exitosamente.');

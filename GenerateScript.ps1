$text = Get-Content 'data\alumnos.js' -Raw
$text = $text -replace '^const albumData = ', ''
# Truncate any trailing semicolon if it exists
$text = $text.TrimEnd().TrimEnd(';')
$json = $text | ConvertFrom-Json

$script = "function generarCarpetasDrive() {`n"
$script += "  var rootFolder = DriveApp.getFolderById('1ot38RflGwNGaiBFQ2epZB0txxYrE_bVr');`n"
$script += "  var alumnosData = [`n"

foreach ($a in $json.alumnos) {
    $nombre = $a.nombre -replace "'",""
    $grupo = $a.grupo -replace "'",""
    $script += "    { nombre: '$nombre', grupo: '$grupo' },`n"
}

$script += "  ];`n"
$script += "  var groupFolders = {};`n"
$script += "  var count = 0;`n"
$script += "  for (var i = 0; i < alumnosData.length; i++) {`n"
$script += "    var alumno = alumnosData[i];`n"
$script += "    var grupo = alumno.grupo;`n"
$script += "    var nombre = alumno.nombre;`n"
$script += "    if (!groupFolders[grupo]) {`n"
$script += "      var existingFolders = rootFolder.getFoldersByName(grupo);`n"
$script += "      if (existingFolders.hasNext()) {`n"
$script += "        groupFolders[grupo] = existingFolders.next();`n"
$script += "      } else {`n"
$script += "        groupFolders[grupo] = rootFolder.createFolder(grupo);`n"
$script += "      }`n"
$script += "    }`n"
$script += "    var parentFolder = groupFolders[grupo];`n"
$script += "    var existingStudentFolders = parentFolder.getFoldersByName(nombre);`n"
$script += "    if (!existingStudentFolders.hasNext()) {`n"
$script += "      parentFolder.createFolder(nombre);`n"
$script += "      count++;`n"
$script += "    }`n"
$script += "  }`n"
$script += "  Logger.log('Se generaron ' + count + ' carpetas.');`n"
$script += "}`n"

Out-File -FilePath 'ScriptParaGoogleDrive.txt' -InputObject $script -Encoding UTF8
Write-Host "Script generated"

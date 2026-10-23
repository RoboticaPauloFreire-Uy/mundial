const fs = require('fs');
let content = fs.readFileSync('c:/Users/Admin/Desktop/Album/js/app.js', 'utf8');
const lines = content.split('\n');

// Keep lines from 0 to 216
// Skip lines 217 to 223 (indices 217-223 correspond to lines 218-224)
// Keep the rest starting from index 224 (line 225)
const newLines = [...lines.slice(0, 217), ...lines.slice(224)];

fs.writeFileSync('c:/Users/Admin/Desktop/Album/js/app.js', newLines.join('\n'), 'utf8');

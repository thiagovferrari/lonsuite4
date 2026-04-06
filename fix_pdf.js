const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// Fix the PDF filename specifically
code = code.replace(/doc\.save\(\`\$\{editingCase\.title\.replace\(\/\\\\s\+\/g, \'_'\)\}\\.pdf\`\);/g, 
  "const safeTitle = (editingCase.title || 'Caso_Clinico').replace(/[\\\\s/?*><|:\"\\\\\\\\]+/g, '_');\\n    doc.save(`${safeTitle}.pdf`);");

fs.writeFileSync('App.tsx', code);

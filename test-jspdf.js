import { jsPDF } from "jspdf";
import fs from "fs";

const doc = new jsPDF();
doc.text("Hello world", 10, 10);
const out = doc.output(); // Returns a string
fs.writeFileSync('test.pdf', out, 'binary');
console.log('PDF generated');

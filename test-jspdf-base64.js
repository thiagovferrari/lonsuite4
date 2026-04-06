import { jsPDF } from "jspdf";
import fs from "fs";

// create a dummy PNG 1x1 base64
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const doc = new jsPDF();
doc.text("Hello world", 10, 10);
try {
  doc.addImage(pngBase64, "PNG", 10, 20, 50, 50);
  const out = doc.output();
  fs.writeFileSync('test-png.pdf', out, 'binary');
  console.log('PDF generated properly with clean base64');
} catch (e) {
  console.error("Failed:", e.message);
}

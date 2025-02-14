const fs = require('fs');
const path = require('path');

// Ambil nama controller dari argument CLI
const args = process.argv.slice(2);
if (args.length === 0) {
    // Tampilkan pesan error jika tidak ada argument
    console.error('\x1b[31m%s\x1b[0m', 'Error: Please provide controller path!');
    process.exit(1);
}

// Dapatkan path controller (misalnya "api/Post")
const controllerPath = args[0];

// Pisahkan path dan nama file
const parts = controllerPath.split('/');
const controllerName = parts.pop();
const folderPath = path.join('src', 'app', 'controllers', ...parts); // Misalnya "controllers/api"

// Pastikan folder tujuan ada
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
}

// Nama file yang akan dibuat
const filePath = path.join(folderPath, `${controllerName}Controller.ts`);

// Template dasar untuk controller
let controllerTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'controller.txt'), 'utf8');
controllerTemplate = controllerTemplate.replace(/{{controllerName}}/g, controllerName);

// Cek apakah file sudah ada
if (fs.existsSync(filePath)) {
    // Tampilkan pesan error jika file sudah ada berwarna merah
    console.error('\x1b[31m%s\x1b[0m', 'Error: File already exist!');
    process.exit(1);
}

// Tulis file controller
fs.writeFileSync(filePath, controllerTemplate.trim());
// console.log(`Created file:`);
// Tampilkan lokasi file yang dibuat berwarna kuning
console.log('Created file: ', `\x1b[32m${filePath}\x1b[0m`);

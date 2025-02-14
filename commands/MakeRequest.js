const fs = require('fs');
const path = require('path');



// Ambil argumen dari CLI
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: Please provide request path!');
    process.exit(1);
}

// Ambil bagian terakhir sebagai nama class
const inputPath = args[0];
const parts = inputPath.split('/');
const className = parts.pop(); // Ambil nama terakhir sebagai nama request
const outputDir = path.join('src/app/requests', ...parts);
const outputPath = path.join(outputDir, `${className}Request.ts`);

// Pastikan direktori tujuan ada
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Cek apakah file sudah ada
if (fs.existsSync(outputPath)) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: File already exist!');
    process.exit(1);
}

// Baca template dan ganti placeholder
const templatePath = path.join(__dirname, 'templates/request.txt');
fs.readFile(templatePath, 'utf8', (err, data) => {
    if (err) {
        // Jika gagal baca template, tampilkan error berwarna merah
        console.error('\x1b[31m%s\x1b[0m', 'Error: Failed to read template file!');
        process.exit(1);
    }

    const content = data.replace(/{{name}}/g, className);

    // Tulis file ke tujuan
    fs.writeFile(outputPath, content, (err) => {
        if (err) {
            // Jika gagal tulis file, tampilkan error berwarna merah
            console.error('\x1b[31m%s\x1b[0m', 'Error: Failed to write file!');
            process.exit(1);
        }
        console.log('Created file: ', `\x1b[32m${outputPath}\x1b[0m`);

    });
});

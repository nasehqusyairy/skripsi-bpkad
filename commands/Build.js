const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.time('Done');
console.log('Starting build process...');
console.log('Running TypeScript compilation...');
console.log('');

// Jalankan tsc terlebih dahulu
exec('tsc', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error during TypeScript compilation: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`TypeScript stderr: ${stderr}`);
    }
    console.log('\x1b[36m%s\x1b[0m', 'TypeScript compilation completed.');
    console.log('');

    // Jalankan minify setelah tsc selesai
    console.log('Running minification process...');

    // Empty line
    console.log('');

    let totalSize = 0; // Untuk menghitung total ukuran file setelah minifikasi

    // Fungsi untuk membaca file dan menghapus spasi serta baris kosong
    function minifyFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');

        // Menghapus semua spasi dan baris kosong yang tidak diperlukan
        const minifiedContent = content.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '').replace(/\n+/g, '');

        fs.writeFileSync(filePath, minifiedContent, 'utf-8');

        // Mendapatkan ukuran file dalam byte
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;
        const fileSizeInKB = fileSizeInBytes / 1024;

        totalSize += fileSizeInKB;

        // Mengubah warna teks menjadi kuning dan menampilkan ukuran file dengan path relatif
        const relativePath = path.relative(__dirname, filePath);
        // console.log('\x1b[33m%s\x1b[0m', `${relativePath} \t ${fileSizeInKB.toFixed(2)} KB`);
    }


    // Fungsi untuk mengunjungi setiap file di folder dist secara rekursif
    function minifyDirectory(directoryPath) {
        const items = fs.readdirSync(directoryPath);

        items.forEach((item) => {
            const itemPath = path.join(directoryPath, item);
            const stats = fs.statSync(itemPath);

            // Jika item adalah folder dan bukan folder types, lakukan rekursi
            if (stats.isDirectory() && item !== 'types') {
                minifyDirectory(itemPath);
            }
            // Jika item adalah file .js, lakukan minifikasi
            else if (stats.isFile() && item.endsWith('.js')) {
                minifyFile(itemPath);
            }
        });
    }

    // Menentukan folder dist
    const distFolder = path.join(__dirname, '../build');

    // fungsi untuk mengumpulkan nama dan ukuran file dalam folder dist secara rekursif
    // fungsi ini mengembalikan array yang berisi objek dengan properti nama dan ukuran
    function getFilesInfo(directoryPath) {
        const items = fs.readdirSync(directoryPath);
        const filesInfo = [];

        items.forEach((item) => {
            const itemPath = path.join(directoryPath, item);
            const stats = fs.statSync(itemPath);

            // Jika item adalah folder dan bukan folder types, lakukan rekursi
            if (stats.isDirectory() && item !== 'types') {
                const subFilesInfo = getFilesInfo(itemPath);
                filesInfo.push(...subFilesInfo);
            }
            // Jika item adalah file .js, tambahkan nama dan ukuran file ke array
            else if (stats.isFile() && item.endsWith('.js')) {
                const fileSizeInBytes = stats.size;
                const fileSizeInKB = fileSizeInBytes / 1024;

                filesInfo.push({
                    Name: itemPath.replace(distFolder, '\\build'),
                    'Size (KB)': fileSizeInKB,
                });
            }
        });

        return filesInfo;
    }


    // Mulai proses minifikasi pada folder dist
    console.log('File minified: ');
    minifyDirectory(distFolder);

    console.table(getFilesInfo(distFolder));

    // Empty line before the completion message
    console.log('');

    // Menampilkan waktu yang dihabiskan
    console.timeEnd('Done');

    // Menampilkan total ukuran file
    console.log(`Total size: ${totalSize.toFixed(2)} KB`)
    console.log('');

    console.log('\x1b[34m%s\x1b[0m', '✔ Build selesai!');
});

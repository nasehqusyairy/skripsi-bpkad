const fs = require("fs");
const path = require("path");
const { DB } = require("./DB");

const migrationsDir = path.join(__dirname, '../build', 'database', 'migrations')

async function runMigrations() {
    try {
        // Baca semua file dalam folder migrations
        const files = fs.readdirSync(migrationsDir)

        console.log('File terdeteksi: ', files);
        console.log('');

        for (const file of files) {
            const filePath = path.join(migrationsDir, file);

            // Import file migration secara dinamis
            const { default: MigrationClass } = require(filePath);

            if (MigrationClass && typeof MigrationClass.up === 'function') {
                console.log('\x1b[33m%s\x1b[0m', `Menjalankan file: ${file}`);
                await MigrationClass.up();
            } else {
                console.log(`Lewati ${file}: Tidak memiliki metode up()`);
            }
        }

    } catch (error) {
        console.error('Terjadi kesalahan saat menjalankan migrasi:', error);
    }
}

// Jalankan migrasi
runMigrations().then(() => {
    DB.end().finally(() => {
        console.log('');
        console.log('\x1b[34m%s\x1b[0m', '✔ Semua migrasi telah dijalankan');
        process.exit();
    });
});

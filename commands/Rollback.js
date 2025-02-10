const fs = require("fs");
const path = require("path");
const { DB } = require("./DB");

const migrationsDir = path.join(__dirname, '../build', 'database', 'migrations')

async function rollbackMigrations() {
    try {
        // Baca semua file dalam folder migrations
        const files = fs.readdirSync(migrationsDir)

        console.log('File terdeteksi: ', files);
        console.log('');


        for (const file of files) {
            const filePath = path.join(migrationsDir, file);

            // Import file migration secara dinamis
            const { default: MigrationClass } = require(filePath);

            if (MigrationClass && typeof MigrationClass.down === 'function') {
                console.log('\x1b[33m%s\x1b[0m', `Rollback pada file: ${file}`);
                await MigrationClass.down();
            } else {
                console.log(`Lewati ${file}: Tidak memiliki metode down()`);
            }
        }
    } catch (error) {
        console.error('Terjadi kesalahan saat menjalankan rollback:', error);
    }
}

// Jalankan rollback
rollbackMigrations().finally(async () => {
    console.log('');
    await DB.end().finally(() => {
        console.log('\x1b[34m%s\x1b[0m', '✔ Rollback selesai');
        process.exit();
    });
});

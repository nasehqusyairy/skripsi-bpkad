const fs = require("fs");
const path = require("path");
const { ScaffoldingDB } = require("./DB");
const { singularize } = require("sequelize/lib/utils");

const DB = ScaffoldingDB;


//#region Constants
const sourceSeeds = process.env.SCAFFOLDING_SOURCE_SEEDS || process.env.SCAFFOLDING_SOURCE_TABLES;
const selectedTables = sourceSeeds?.split(",").map(e => e.trim()) || [];
const MAX_RECORDS = process.env.SCAFFOLDING_MAX_RECORD; // Default max record jika tidak diset
const OUTPUT_DIR = path.join("src", "database", "seeders");

// Path template
const MODEL_TEMPLATE_PATH = path.join("commands", "templates", "model_seeder.txt");
const SQL_TEMPLATE_PATH = path.join("commands", "templates", "sql_seeder.txt");
const DATABASE_SEEDER_TEMPLATE_PATH = path.join("commands", "templates", "database_seeder.txt");

const MODELS_DIR = path.join("src", "app", "models");
//#endregion

//#region Auto run
(async () => {
    console.log("Generating seeders...");
    console.log("");
    console.time('Done');

    try {
        const connection = DB;
        const [tables] = await connection.execute("SHOW TABLES");
        const seederClasses = [];

        for (const tableObj of tables) {
            const tableName = Object.values(tableObj)[0];

            // Jika ada filter, hanya scaffold tabel yang sesuai
            if (selectedTables.length > 0 && !selectedTables.includes(tableName)) {
                continue;
            }

            const className = `${toPascalCaseSingular(tableName)}Seeder`;
            const modelName = toPascalCaseSingular(tableName);
            const modelPath = path.join(MODELS_DIR, `${modelName}.ts`);

            const query = `SELECT * FROM ${tableName}` + (MAX_RECORDS ? ` LIMIT ${MAX_RECORDS}` : '');

            const [rows] = await connection.execute(query);

            if (rows.length > 0) {
                let seederContent;

                if (fs.existsSync(modelPath)) {
                    // Gunakan metode insert dari model jika tersedia
                    seederContent = generateModelSeederContent(className, modelName, rows);
                } else {
                    // Gunakan query SQL insert jika model tidak ditemukan
                    seederContent = generateSQLSeederContent(className, tableName, rows);
                }

                const filePath = path.join(OUTPUT_DIR, `${className}.ts`);
                fs.writeFileSync(filePath, seederContent, "utf8");
                console.log('\x1b[33m%s\x1b[0m', `Seeder generated: ${filePath}`);

                seederClasses.push(className); // Simpan nama kelas seeder
            }
        }

        // Buat DatabaseSeeder.ts setelah semua seeder selesai dibuat
        if (seederClasses.length > 0) {

            // ambil nama kelas seeder dari folder seeders
            const seeders = fs.readdirSync(OUTPUT_DIR);
            const seederClasses = seeders.map(file => file.replace('.ts', '')).filter(file => file !== 'DatabaseSeeder');
            generateDatabaseSeeder(seederClasses);
            console.timeEnd('Done');
        }

        await connection.end().finally(() => {
            console.log('');
            console.log('\x1b[34m%s\x1b[0m', '✔ Seeder generation completed');
            process.exit();
        });
    } catch (error) {
        console.error("Error generating seeders:", error);
    }
})();
//#endregion

//#region DatabaseSeeder.ts Generator
// Fungsi untuk membuat DatabaseSeeder.ts
function generateDatabaseSeeder(seederClasses) {

    console.log('');
    console.log("Generating DatabaseSeeder.ts...");

    const seederImports = seederClasses.map(cls => `import { ${cls} } from "./${cls}";`).join("\n");
    const seederList = seederClasses.join(",\n        ");

    const databaseSeederContent = applyTemplate(DATABASE_SEEDER_TEMPLATE_PATH, {
        seederImports,
        seederList
    });

    const filePath = path.join(OUTPUT_DIR, "DatabaseSeeder.ts");
    fs.writeFileSync(filePath, databaseSeederContent, "utf8");
}
//#endregion

//#region Utils
// Fungsi untuk mengganti placeholder dalam template dengan nilai yang diberikan
function applyTemplate(templatePath, replacements) {
    let template = fs.readFileSync(templatePath, "utf8");
    return Object.keys(replacements).reduce(
        (content, key) => content.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]),
        template
    );
}

// Fungsi untuk mengubah nama tabel menjadi versi singular PascalCase
function toPascalCaseSingular(tableName) {
    const singularName = singularize(tableName); // Menggunakan Sequelize untuk mendapatkan bentuk singular
    return singularName.replace(/_([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, str => str.toUpperCase());
}
//#endregion

//#region Seeder Generators
function generateModelSeederContent(className, modelName, records) {
    return applyTemplate(MODEL_TEMPLATE_PATH, {
        className,
        modelName,
        records: JSON.stringify(records, null, 4),
    });
}

function generateSQLSeederContent(className, tableName, records) {
    return applyTemplate(SQL_TEMPLATE_PATH, {
        className,
        tableName,
        records: JSON.stringify(records, null, 4),
    });
}
//#endregion
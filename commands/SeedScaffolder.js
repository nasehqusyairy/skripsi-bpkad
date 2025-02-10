const fs = require("fs");
const path = require("path");
const { DB } = require("./DB");
const { singularize } = require("sequelize/lib/utils");

const MAX_RECORDS = process.env.SCAFFOLDING_MAX_RECORD || 100; // Default max record jika tidak diset
const OUTPUT_DIR = path.join("src", "database", "seeders");

// Path template
const MODEL_TEMPLATE_PATH = path.join("commands", "templates", "model_seeder.txt");
const SQL_TEMPLATE_PATH = path.join("commands", "templates", "sql_seeder.txt");

const MODELS_DIR = path.join("src", "app", "models");


// Fungsi untuk mengubah nama tabel menjadi versi singular PascalCase
function toPascalCaseSingular(tableName) {
    const singularName = singularize(tableName); // Menggunakan Sequelize untuk mendapatkan bentuk singular
    return singularName.replace(/_([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, str => str.toUpperCase());
}


(async () => {
    console.log("Generating seeders...");
    console.log("");

    try {
        const connection = DB;
        const [tables] = await connection.execute("SHOW TABLES");

        for (const tableObj of tables) {
            const tableName = Object.values(tableObj)[0];
            const className = `${toPascalCaseSingular(tableName)}Seeder`;
            const modelName = toPascalCaseSingular(tableName);
            const modelPath = path.join(MODELS_DIR, `${modelName}.ts`);

            const [rows] = await connection.execute(`SELECT * FROM ${tableName} LIMIT ?`, [MAX_RECORDS]);

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
            }
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

// Fungsi untuk menggantikan placeholder di template
function applyTemplate(templatePath, replacements) {
    let template = fs.readFileSync(templatePath, "utf8");
    return Object.keys(replacements).reduce(
        (content, key) => content.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]),
        template
    );
}

// Generator untuk model seeder
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

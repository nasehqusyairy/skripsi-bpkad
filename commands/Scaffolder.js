const fs = require("fs");
const path = require("path");
const { DB } = require("./DB");


async function generate() {
    console.log('\x1b[34m%s\x1b[0m', 'Memulai proses scaffolding...');
    console.time('done');

    // Ambil daftar tabel dari database
    const [tables] = await DB.execute("SHOW TABLES");


    for (const table of tables) {
        const tableName = table[`Tables_in_${DB.pool.config.connectionConfig.database}`];
        // Ambil informasi kolom
        const [columns] = await DB.execute(`DESCRIBE ${tableName}`);

        // Buat file migrasi
        await generateMigration(tableName, columns);

        // Buat file model (hanya untuk tabel yang bukan pivot)
        if (!tableName.includes("_")) {
            await generateModel(tableName, columns);
        }
    }

    const createdMigrations = fs.readdirSync("src/database/migrations");
    const createdModels = fs.readdirSync("src/app/models");

    console.log('');
    console.log("Migrasi dibuat:");
    for (const migration of createdMigrations) {
        console.log('\x1b[33m%s\x1b[0m', migration);
    }

    console.log('');
    console.log("Model dibuat:");
    for (const model of createdModels) {
        console.log('\x1b[33m%s\x1b[0m', model);
    }

    DB.end();
    console.log('');
    console.timeEnd('done');
    console.log('\x1b[32m%s\x1b[0m', '✔ Scaffolding selesai!');
}

async function generateMigration(tableName, columns) {
    // Baca template migrasi
    const templatePath = path.join("commands", "templates", "migration.txt");
    let template = fs.readFileSync(templatePath, "utf-8");

    // Generate nama file dan class
    const timestamp = Math.floor(Date.now() / 1000);
    const className = `${toPascalCase(tableName)}Table`;
    const fileName = `${className}.ts`;

    // Generate kolom untuk migrasi
    let columnsDefinition = "";
    for (const column of columns) {
        const columnName = column.Field;
        const columnType = column.Type;
        const isNullable = column.Null === "YES";
        const isPrimaryKey = column.Key === "PRI";
        const isAutoIncrement = column.Extra.includes("auto_increment");
        let defaultValue = column.Default ? `'${column.Default}'` : null;

        // Jika kolom adalah 'id', gunakan table.id()
        if (columnName === "id") {
            columnsDefinition += `            table.id()`;
            if (isNullable) columnsDefinition += `.nullable()`;
            columnsDefinition += `;\n`;
            continue;
        }

        // Tambahkan kolom ke migrasi
        const chain = `            table.${mapColumnType(columnType)}('${columnName}')`;
        columnsDefinition += chain;

        if (isAutoIncrement) {
            columnsDefinition += `.autoIncrement()`;
        }

        if (isPrimaryKey) {
            columnsDefinition += `.primary()`;
            columnsDefinition += `;\n`;
            continue;
        }

        if (isNullable) columnsDefinition += `.nullable()`;
        if (defaultValue) {
            let isRaw = false;
            if (defaultValue === "'current_timestamp()'") {
                if (columnName === "updated_at") {
                    defaultValue = "'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'";
                } else {
                    defaultValue = "'CURRENT_TIMESTAMP'";
                }
                isRaw = true;
            }
            columnsDefinition += `.default(${defaultValue},${isRaw})`
        }
        columnsDefinition += `;\n`;
    }

    // Ganti placeholder di template
    template = template
        .replace(/{{className}}/g, className)
        .replace(/{{tableName}}/g, tableName)
        .replace(/{{columns}}/g, columnsDefinition.trim());

    // Simpan file migrasi
    const migrationPath = path.join("src", "database", "migrations", fileName);
    fs.writeFileSync(migrationPath, template);
}

async function generateModel(tableName, columns) {
    // Baca template model
    const templatePath = path.join("commands", "templates", "model.txt");
    let template = fs.readFileSync(templatePath, "utf-8");

    // Generate nama class
    const className = toPascalCase(toSingular(tableName));

    // Generate daftar field untuk interface
    let fieldsDefinition = columns
        .map(col => `    ${col.Field}${col.Null === "YES" ? "?" : ""}: ${mapTsType(col.Type)};`)
        .join("\n");

    // Ganti placeholder di template
    template = template
        .replace(/{{className}}/g, className)
        .replace(/{{fields}}/g, fieldsDefinition);

    // Simpan file model
    const modelPath = path.join("src", "app", "models", `${className}.ts`);
    fs.writeFileSync(modelPath, template);
}

function mapTsType(columnType) {
    if (columnType.startsWith("int") || columnType.startsWith("bigint")) return "number";
    if (columnType.startsWith("varchar") || columnType.startsWith("text")) return "string";
    if (columnType.startsWith("timestamp") || columnType.startsWith("datetime")) return "Date";
    if (columnType.startsWith("boolean") || columnType.startsWith("tinyint(1)")) return "boolean";
    return "any"; // Default jika tipe tidak dikenali
}


function mapColumnType(columnType) {
    // if (columnType.startsWith("varchar")) return "string";
    if (columnType.startsWith("int")) return "integer";
    if (columnType.startsWith("bigint")) return "bigint";
    if (columnType.startsWith("text")) return "text";
    if (columnType.startsWith("timestamp")) return "timestamp";
    return "string";
}

function toPascalCase(str) {
    return str.replace(/(^\w|_\w)/g, (match) => match.replace(/_/, "").toUpperCase());
}

function toSingular(str) {
    // Konversi plural ke singular (contoh sederhana)
    if (str.endsWith("ies")) return str.replace(/ies$/, "y");
    if (str.endsWith("s")) return str.replace(/s$/, "");
    return str;
}


generate();

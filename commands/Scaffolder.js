const fs = require("fs");
const path = require("path");
const { DB } = require("./DB");
const { singularize, pluralize } = require("sequelize/lib/utils");

//#region Generate
async function generate() {
    console.log('\x1b[34m%s\x1b[0m', 'Memulai proses scaffolding...');
    console.time('Done');

    // Ambil daftar tabel dari database
    const [tables] = await DB.execute("SHOW TABLES");
    const databaseName = DB.pool.config.connectionConfig.database;

    let allTables = [];

    for (const table of tables) {
        const tableName = table[`Tables_in_${databaseName}`];

        // Ambil informasi kolom
        const [columns] = await DB.execute(`DESCRIBE ${tableName}`);

        // Simpan tabel dan kolom ke allTables
        allTables.push({ name: tableName, columns });

        // Buat file migrasi
        await generateMigration(tableName, columns);

        // Buat file model (hanya untuk tabel yang bukan pivot)
        if (!tableName.includes("_")) {
            await generateModel(tableName, columns, allTables); // Kirim allTables dengan struktur yang benar
        }
    }

    const migrationPath = path.join("src", "database", "migrations");
    const modelPath = path.join("src", "app", "models");

    const createdMigrations = fs.readdirSync(migrationPath);
    const createdModels = fs.readdirSync(modelPath);

    console.log('');
    console.log("Migrasi dibuat:");
    for (const migration of createdMigrations) {
        console.log('\x1b[33m%s\x1b[0m', migrationPath + migration);
    }

    console.log('');
    console.log("Model dibuat:");
    for (const model of createdModels) {
        console.log('\x1b[33m%s\x1b[0m', modelPath + model);
    }

    DB.end();
    console.log('');
    console.timeEnd('Done');
    console.log('\x1b[32m%s\x1b[0m', '✔ Scaffolding selesai!');
}
//#endregion


//#region Migration
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
//#endregion

//#region Model
async function generateModel(tableName, columns, allTables) {
    const templatePath = path.join("commands", "templates", "model.txt");
    let template = fs.readFileSync(templatePath, "utf-8");

    const className = toPascalCase(toSingular(tableName));

    // Mendeteksi foreign key berdasarkan pola penamaan & mendapatkan daftar import
    const { relations, relationImports } = detectRelations(tableName, columns, allTables);

    // Generate daftar field untuk interface
    let fieldsDefinition = columns
        .map(col => `    ${col.Field}${col.Null === "YES" ? "?" : ""}: ${mapTsType(col.Type)};`)
        .join("\n");

    // Buat string import relasi
    const relationImportsCode = relationImports
        .map(cls => `import { ${cls} } from "./${cls}";`)
        .join("\n");

    // Ganti placeholder dalam template
    template = template
        .replace(/{{className}}/g, className)
        .replace(/{{fields}}/g, fieldsDefinition)
        .replace(/{{relationImports}}/g, relationImportsCode) // Tambahkan baris import
        .replace(/{{relations}}/g, relations);

    const modelPath = path.join("src", "app", "models", `${className}.ts`);
    fs.writeFileSync(modelPath, template);
}
//#endregion

//#region Relation
function detectRelations(tableName, columns, allTables) {
    let relations = "";
    let relationImports = new Set(); // Gunakan Set agar tidak ada duplikat

    // 1. Mendeteksi belongsTo (tabel ini memiliki kolom *_id)
    for (const column of columns) {
        if (column.Field.endsWith("_id")) {
            const relatedClass = toPascalCase(column.Field.replace("_id", ""));
            relationImports.add(relatedClass); // Tambahkan ke daftar import

            relations += `\n    public ${toCamelCase(relatedClass)}() {`;
            relations += `\n        return this.belongsTo(${relatedClass}, '${column.Field}');`;
            relations += `\n    }\n`;
        }
    }

    // 2. Mendeteksi hasMany (tabel lain memiliki kolom <tableName>_id)
    for (const otherTable of allTables) {
        if (otherTable.name !== tableName && !isPivotTable(otherTable.name)) {
            for (const col of otherTable.columns) {
                if (col.Field === `${toSingular(tableName)}_id`) {
                    const relationName = otherTable.name;
                    const relatedClass = toPascalCase(toSingular(relationName));
                    relationImports.add(relatedClass); // Tambahkan ke daftar import

                    relations += `\n    public ${toCamelCase(relationName)}() {`;
                    relations += `\n        return this.hasMany(${relatedClass}, '${col.Field}');`;
                    relations += `\n    }\n`;
                }
            }
        }
    }

    return {
        relations: relations.trim(),
        relationImports: Array.from(relationImports), // Ubah Set menjadi Array
    };
}
//#endregion

//#region Type Mapper
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
//#endregion

//#region Utils
function toPascalCase(str) {
    return str.replace(/(^\w|_\w)/g, (match) => match.replace(/_/, "").toUpperCase());
}

function toSingular(str) {
    return singularize(str);
}

function isPivotTable(tableName) {
    return tableName.includes("_"); // Deteksi pivot berdasarkan nama tabel
}

function toPlural(str) {
    return pluralize(str);
}

function toCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
//#endregion

generate();

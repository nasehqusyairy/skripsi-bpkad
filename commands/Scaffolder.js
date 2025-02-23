const fs = require("fs");
const path = require("path");
const { ScaffoldingDB } = require("./DB");
const { singularize, pluralize } = require("sequelize/lib/utils");

const DB = ScaffoldingDB;
const command = process.argv[2];
const selectedTables = process.argv.slice(3) || process.env.SCAFFOLDING_SOURCE_TABLES?.split(",").map(e => e.trim()) || [];

async function getExistingMigrations() {
    const migrationPath = path.join("src", "database", "migrations");
    return fs.existsSync(migrationPath) ? fs.readdirSync(migrationPath).map(f => f.replace(/Table\.ts$/, "").toLowerCase()) : [];
}

async function getExistingModels() {
    const modelPath = path.join("src", "app", "models");
    return fs.existsSync(modelPath) ? fs.readdirSync(modelPath).map(f => f.replace(/\.ts$/, "").toLowerCase()) : [];
}

//#region Generate
async function generate(targetTables) {

    const isWillScaffoldAllTables = targetTables === undefined
    if (isWillScaffoldAllTables) {
        console.log('\x1b[33m%s\x1b[0m', 'Tidak ada tabel yang dipilih. Semua tabel akan di-scaffold.');
    }
    targetTables = targetTables || [];

    console.log('\x1b[34m%s\x1b[0m', 'Memulai proses scaffolding...');
    console.time('Done');

    // Ambil daftar tabel dari database
    const [tables] = await DB.execute("SHOW TABLES");
    const databaseName = DB.pool.config.connectionConfig.database;

    let allTables = [];
    const createdMigrations = [];
    const createdModels = [];

    for (const table of tables) {
        const tableName = table[`Tables_in_${databaseName}`];

        // Jika ada filter, hanya scaffold tabel yang sesuai
        if (targetTables.length > 0 && !targetTables.includes(tableName)) {
            continue;
        }

        // Ambil informasi kolom
        const [columns] = await DB.execute(`DESCRIBE ${tableName}`);

        // Simpan tabel dan kolom ke allTables
        allTables.push({ name: tableName, columns });

        // Buat file migrasi
        createdMigrations.push(await generateMigration(tableName, columns));

        // Buat file model (hanya untuk tabel yang bukan pivot)

        if (!tableName.includes("_") && (isWillScaffoldAllTables || targetTables.length > 0)) {
            createdModels.push(await generateModel(tableName, columns, allTables));
        }
    }

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
    return migrationPath;
}
//#endregion

//#region Model
async function generateModel(tableName, columns, allTables) {
    const templatePath = path.join("commands", "templates", "model.txt");
    let template = fs.readFileSync(templatePath, "utf-8");

    let className;
    let protectedTableName = "";

    if (isLaravelFriendlyName(tableName)) {
        className = toPascalCase(singularize(tableName)); // Singular PascalCase
    } else {
        className = toPascalCase(tableName); // PascalCase
        protectedTableName = `\n    protected tableName = "${tableName}";\n`;
    }

    // Cari kolom primary key
    const primaryKeyColumn = columns.find(col => col.Key === "PRI");
    let primaryKeyConfig = "";
    if (primaryKeyColumn && primaryKeyColumn.Field !== "id") {
        primaryKeyConfig = `\n    protected primaryKey = "${primaryKeyColumn.Field}";\n`;
    }


    const { relations, relationImports, relationFields } = detectRelations(tableName, columns, allTables);

    let fieldsDefinition = columns
        .map(col => `    ${col.Field}${col.Null === "YES" ? "?" : ""}: ${mapTsType(col.Type)};`)
        .join("\n");

    const relationImportsCode = relationImports
        .map(cls => `import { ${cls}, I${cls} } from "./${cls}";`)
        .join("\n");

    fieldsDefinition += relationFields;

    template = template
        .replace(/{{className}}/g, className)
        .replace(/{{fields}}/g, fieldsDefinition)
        .replace(/{{relationImports}}/g, relationImportsCode)
        .replace(/{{relations}}/g, relations)
        .replace(/{{protectedTableName}}/g, protectedTableName)
        .replace(/{{primaryKeyConfig}}/g, primaryKeyConfig)

    const modelPath = path.join("src", "app", "models", `${className}.ts`);
    fs.writeFileSync(modelPath, template);
    return modelPath;
}
//#endregion

//#region Relation
function detectRelations(tableName, columns, allTables) {
    let relations = "";
    let relationImports = new Set(); // Gunakan Set agar tidak ada duplikat
    let relationFields = ""

    // 1. Mendeteksi belongsTo (tabel ini memiliki kolom *_id)
    for (const column of columns) {
        if (column.Field.endsWith("_id")) {
            const relatedClass = toPascalCase(column.Field.replace("_id", ""));
            relationImports.add(relatedClass); // Tambahkan ke daftar import
            relationFields += `\n    ${toCamelCase(relatedClass)}?: ${relatedClass} & I${relatedClass};`;

            relations += `\n    ${toCamelCase(relatedClass)}() {`;
            relations += `\n        return this.belongsTo(${relatedClass});`;
            relations += `\n    }\n`;
        }
    }

    // 2. Mendeteksi hasMany (tabel lain memiliki kolom <tableName>_id)
    for (const otherTable of allTables) {
        if (otherTable.name !== tableName && !isPivotTable(otherTable.name)) {
            for (const col of otherTable.columns) {
                if (col.Field === `${singularize(tableName)}_id`) {
                    const relationName = otherTable.name;
                    const relatedClass = toPascalCase(singularize(relationName));
                    relationImports.add(relatedClass); // Tambahkan ke daftar import
                    relationFields += `\n    ${toCamelCase(relationName)}?: (${relatedClass} & I${relatedClass})[];`;

                    relations += `\n    ${toCamelCase(relationName)}() {`;
                    relations += `\n        return this.hasMany(${relatedClass});`;
                    relations += `\n    }\n`;
                }
            }
        }
    }

    return {
        relations: relations.trim(),
        relationImports: Array.from(relationImports), // Ubah Set menjadi Array
        relationFields: relationFields
    };
}
//#endregion

//#region Type Mapper
function mapTsType(columnType) {
    if (columnType.startsWith("int") || columnType.startsWith("bigint")) return "number";
    if (columnType.startsWith("varchar") || columnType.startsWith("text")) return "string";
    if (columnType.startsWith("timestamp") || columnType.startsWith("datetime")) return "string";
    // if (columnType.startsWith("boolean") || columnType.startsWith("tinyint(1)")) return "boolean";
    if (columnType.startsWith("boolean") || columnType.startsWith("tinyint(1)")) return "number";
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
function isLaravelFriendlyName(tableName) {
    return tableName === pluralize(tableName).toLowerCase();
}

function toPascalCase(str) {
    return str.replace(/(^\w|_\w)/g, (match) => match.replace(/_/, "").toUpperCase());
}

function isPivotTable(tableName) {
    return tableName.includes("_"); // Deteksi pivot berdasarkan nama tabel
}

function toCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
//#endregion

async function scaffoldNewTables() {

    const [tables] = await DB.execute("SHOW TABLES");
    const databaseName = DB.pool.config.connectionConfig.database;
    const allTables = tables.map(t => t[`Tables_in_${databaseName}`]);
    const existingMigrations = await getExistingMigrations();
    const existingModels = await getExistingModels();

    const newTables = allTables.filter(table => (!(existingMigrations.includes(table.toLowerCase()) && existingModels.map(m => pluralize(m)).includes(table.toLowerCase()))) && !isPivotTable(table));

    if (newTables.length === 0) {
        console.log('\x1b[33m%s\x1b[0m', 'Tidak ada tabel baru untuk di-scaffold.');
        process.exit();
        return;
    }

    await generate(newTables);
}

async function scaffoldFind() {
    if (process.argv.slice(3).length === 0) {
        console.log('\x1b[31m%s\x1b[0m', 'Harap tentukan tabel yang ingin di-scaffold!');
        return;
    }

    await generate(selectedTables);
}

async function main() {
    switch (command) {
        case "--new-tables":
            await scaffoldNewTables();
            break;
        case "--find":
            await scaffoldFind();
            break;
        default:
            await generate();
            break;
    }
}

main();

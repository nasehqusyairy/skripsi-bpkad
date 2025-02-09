const fs = require("fs");
const path = require("path");
const { DB } = require("./DB");

const MAX_RECORDS = process.env.SCAFFOLDING_MAX_RECORD; // Default max record
const OUTPUT_DIR = path.join('src', 'database', 'seeders');
const TEMPLATE_PATH = path.join('commands', "templates", "seeder.txt");

(async () => {
    try {
        const connection = DB;
        const [tables] = await connection.execute("SHOW TABLES");

        for (const tableObj of tables) {
            const tableName = Object.values(tableObj)[0];
            const className = tableName.replace(/_([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, str => str.toUpperCase());
            const [rows] = await connection.execute(`SELECT * FROM ${tableName} LIMIT ?`, [MAX_RECORDS]);

            if (rows.length > 0) {
                const seederContent = generateSeederContent(className, tableName, rows);
                const filePath = path.join(OUTPUT_DIR, `${className}Seeder.ts`);
                fs.writeFileSync(filePath, seederContent, 'utf8');
                console.log(`Seeder generated: ${filePath}`);
            }
        }

        await connection.end();
    } catch (error) {
        console.error("Error generating seeders:", error);
    }
})();

function generateSeederContent(className, tableName, records) {
    let template = fs.readFileSync(TEMPLATE_PATH, "utf8");

    return template
        .replace("{{className}}", className)
        .replace("{{tableName}}", tableName)
        .replace("{{records}}", JSON.stringify(records, null, 4));
}

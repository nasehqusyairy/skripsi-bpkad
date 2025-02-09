import { MYSQL as DB } from "../DB";
import { Blueprint } from "./Blueprint";

export class Schema {
    static async create(tableName: string, callback: (blueprint: Blueprint) => void) {
        const blueprint = new Blueprint(tableName);
        callback(blueprint);

        let columnsDefinition = blueprint.columns.map(column => {
            let columnDefinition = `${column.name} ${column.type}`;
            if (column.length) {
                columnDefinition += `(${column.length})`;
            }
            if (column.primaryKey) {
                columnDefinition += ' PRIMARY KEY';
            }
            if (column.autoIncrement) {
                columnDefinition += ' AUTO_INCREMENT';
            }
            if (column.default !== undefined) {
                columnDefinition += ` DEFAULT ${column.default}`;
            }
            if (!column.nullable) {
                columnDefinition += ' NOT NULL';
            }
            return columnDefinition;
        }).join(', ');

        let foreignKeysDefinition = blueprint.foreignKeys.map(fk => {
            return `FOREIGN KEY (${fk.column}) REFERENCES ${fk.references}(${fk.on})`;
        }).join(', ');

        let query = `CREATE TABLE ${tableName} (${columnsDefinition}`;
        if (foreignKeysDefinition) {
            query += `, ${foreignKeysDefinition}`;
        }
        query += ')';

        // Eksekusi query ke database
        await DB.execute(query);
    }

    static async drop(tableName: string) {
        const query = `DROP TABLE IF EXISTS ${tableName}`;
        await DB.execute(query);
    }
}

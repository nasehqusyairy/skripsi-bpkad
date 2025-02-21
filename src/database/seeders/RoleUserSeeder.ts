import 'module-alias/register';
import { MYSQL as DB } from "@/utils/database/DB";
import fs from 'fs';
import path from 'path';

export class RoleUserSeeder {
    static async run() {
        const records = JSON.parse(fs.readFileSync(path.join("seeds", "RoleUserSeeder.json"), "utf8"));
        let keys = Object.keys(records[0]);
        let values = records
            .map(row => `(${keys.map(key => JSON.stringify(row[key])).join(", ")})`)
            .join(",\n        ");

        await DB.execute(`INSERT INTO role_user (${keys.join(", ")}) VALUES
        ${values};`);
    }
}

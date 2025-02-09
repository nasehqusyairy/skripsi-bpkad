import 'module-alias/register';
import { MYSQL as DB } from "@/utils/database/DB";

export class RolesSeeder {
    static async run() {
        const data = [
    {
        "id": 1,
        "name": "admin",
        "created_at": "2025-02-08T21:08:32.000Z",
        "updated_at": "2025-02-08T21:08:32.000Z"
    }
];

        for (const record of data) {
            await DB.query(
                `INSERT INTO roles (${Object.keys(record).join(', ')}) VALUES (${Object.values(record).map(v => '?').join(', ')})`,
                Object.values(record)
            );
        }
    }
}

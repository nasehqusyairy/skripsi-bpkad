import 'module-alias/register';
import { MYSQL as DB } from "@/utils/database/DB";

export class RoleUserSeeder {
    static async run() {
        const data = [
    {
        "id": 1,
        "nama_relasi": "relasi1",
        "user_id": 1,
        "role_id": 1,
        "created_at": "2025-02-08T21:08:55.000Z",
        "updated_at": "2025-02-09T04:45:38.000Z"
    }
];

        for (const record of data) {
            await DB.query(
                `INSERT INTO role_user (${Object.keys(record).join(', ')}) VALUES (${Object.values(record).map(v => '?').join(', ')})`,
                Object.values(record)
            );
        }
    }
}

import 'module-alias/register';
import { MYSQL as DB } from "@/utils/database/DB";

export class UsersSeeder {
    static async run() {
        const data = [
    {
        "id": 1,
        "email": "admin@example.com",
        "password": "$2b$12$yC6c8tCFuR1pUlnrpSSCK.Kqx66Rt4rWRqxiCq6ZZgu5sMsDRopoW",
        "created_at": "2025-02-08T20:53:50.000Z",
        "updated_at": "2025-02-08T20:53:50.000Z"
    }
];

        for (const record of data) {
            await DB.query(
                `INSERT INTO users (${Object.keys(record).join(', ')}) VALUES (${Object.values(record).map(v => '?').join(', ')})`,
                Object.values(record)
            );
        }
    }
}

import 'module-alias/register';
import { Role } from "@/app/models/Role";

export class RoleSeeder {
    static async run() {
        await Role.insert([
    {
        "id": 1,
        "name": "admin",
        "created_at": "2025-02-07T10:08:32.000Z",
        "updated_at": "2025-02-07T10:08:32.000Z"
    }
]);
    }
}

import 'module-alias/register';
import { User } from "@/app/models/User";

export class UserSeeder {
    static async run() {
        await User.insert([
    {
        "id": 1,
        "email": "admin@example.com",
        "password": "$2b$12$yC6c8tCFuR1pUlnrpSSCK.Kqx66Rt4rWRqxiCq6ZZgu5sMsDRopoW",
        "created_at": "2025-02-07T16:53:50.000Z",
        "updated_at": "2025-02-07T16:53:50.000Z"
    }
]);
    }
}

import { User } from "@/app/models/User";


export class UserSeeder {
    static async run() {
        // masukkan logika seeding di sini
        await User.create({
            email: 'admin@example.com',
            password: '$2b$12$yC6c8tCFuR1pUlnrpSSCK.Kqx66Rt4rWRqxiCq6ZZgu5sMsDRopoW',
        });

    }
}
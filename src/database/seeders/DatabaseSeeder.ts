import "module-alias/register";
import { MYSQL as DB } from "@/utils/database/DB";
import { UserSeeder } from "./UserSeeder";
import { RoleSeeder } from "./RoleSeeder";
import { RoleUserSeeder } from "./RoleUserSeeder";


(async () => {

    const seeders = [
        UserSeeder,
        RoleSeeder,
        RoleUserSeeder
    ]

    for (const seeder of seeders) {
        await seeder.run();
    }

    await DB.end().finally(() => {
        console.log('\x1b[34m%s\x1b[0m', '✔ Database telah terisi');
    });
})()
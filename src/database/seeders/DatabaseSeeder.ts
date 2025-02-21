import "module-alias/register";
import { MYSQL as DB } from "@/utils/database/DB";
import { BMDetailSubkegiatanSeeder } from "./BMDetailSubkegiatanSeeder";
import { BMKegiatanSeeder } from "./BMKegiatanSeeder";
import { BMKomponenRealisasiSeeder } from "./BMKomponenRealisasiSeeder";
import { BMKomponenSeeder } from "./BMKomponenSeeder";
import { BMOrgSeeder } from "./BMOrgSeeder";
import { BMProgramSeeder } from "./BMProgramSeeder";
import { BMSshbdSeeder } from "./BMSshbdSeeder";
import { BMSubkegiatanSeeder } from "./BMSubkegiatanSeeder";
import { MTahapanSeeder } from "./MTahapanSeeder";
import { CommentSeeder } from "./CommentSeeder";
import { PostSeeder } from "./PostSeeder";
import { RoleSeeder } from "./RoleSeeder";
import { RoleUserSeeder } from "./RoleUserSeeder";
import { UserSeeder } from "./UserSeeder";

(async () => {
    const seeders = [
        BMDetailSubkegiatanSeeder,
        BMKegiatanSeeder,
        BMKomponenRealisasiSeeder,
        BMKomponenSeeder,
        BMOrgSeeder,
        BMProgramSeeder,
        BMSshbdSeeder,
        BMSubkegiatanSeeder,
        MTahapanSeeder,
        CommentSeeder,
        PostSeeder,
        RoleSeeder,
        RoleUserSeeder,
        UserSeeder
    ];

    for (const seeder of seeders) {
        await seeder.run();
    }

    await DB.end().finally(() => {
        console.log('\x1b[34m%s\x1b[0m', '✔ Database telah terisi');
    });
})();

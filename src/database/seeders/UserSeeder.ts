import 'module-alias/register';
import { User } from "@/app/models/User";
import fs from 'fs';
import path from 'path';

export class UserSeeder {
    static async run() {
        await User.insert(JSON.parse(fs.readFileSync(path.join("seeds", "UserSeeder.json"), "utf8")));
    }
}

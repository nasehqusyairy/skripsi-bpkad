import 'module-alias/register';
import { Role } from "@/app/models/Role";
import fs from 'fs';
import path from 'path';

export class RoleSeeder {
    static async run() {
        await Role.insert(JSON.parse(fs.readFileSync(path.join("seeds", "RoleSeeder.json"), "utf8")));
    }
}

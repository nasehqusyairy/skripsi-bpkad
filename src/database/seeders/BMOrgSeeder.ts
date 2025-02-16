import 'module-alias/register';
import { BMOrg } from "@/app/models/BMOrg";
import fs from 'fs';
import path from 'path';

export class BMOrgSeeder {
    static async run() {
        await BMOrg.insert(JSON.parse(fs.readFileSync(path.join("seeds", "BMOrgSeeder.json"), "utf8")));
    }
}

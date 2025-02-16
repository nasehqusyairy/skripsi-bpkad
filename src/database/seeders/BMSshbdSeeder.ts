import 'module-alias/register';
import { BMSshbd } from "@/app/models/BMSshbd";
import fs from 'fs';
import path from 'path';

export class BMSshbdSeeder {
    static async run() {
        await BMSshbd.insert(JSON.parse(fs.readFileSync(path.join("seeds", "BMSshbdSeeder.json"), "utf8")));
    }
}

import 'module-alias/register';
import { BMKomponen } from "@/app/models/BMKomponen";
import fs from 'fs';
import path from 'path';

export class BMKomponenSeeder {
    static async run() {
        await BMKomponen.insert(JSON.parse(fs.readFileSync(path.join("seeds", "BMKomponenSeeder.json"), "utf8")));
    }
}

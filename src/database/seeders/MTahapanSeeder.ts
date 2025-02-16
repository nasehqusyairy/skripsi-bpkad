import 'module-alias/register';
import { MTahapan } from "@/app/models/MTahapan";
import fs from 'fs';
import path from 'path';

export class MTahapanSeeder {
    static async run() {
        await MTahapan.insert(JSON.parse(fs.readFileSync(path.join("seeds", "MTahapanSeeder.json"), "utf8")));
    }
}

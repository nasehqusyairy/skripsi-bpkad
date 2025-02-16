import 'module-alias/register';
import { BMSubkegiatan } from "@/app/models/BMSubkegiatan";
import fs from 'fs';
import path from 'path';

export class BMSubkegiatanSeeder {
    static async run() {
        await BMSubkegiatan.insert(JSON.parse(fs.readFileSync(path.join("seeds", "BMSubkegiatanSeeder.json"), "utf8")));
    }
}

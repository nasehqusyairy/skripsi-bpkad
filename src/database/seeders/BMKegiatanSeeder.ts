import 'module-alias/register';
import { BMKegiatan } from "@/app/models/BMKegiatan";
import fs from 'fs';
import path from 'path';

export class BMKegiatanSeeder {
    static async run() {
        await BMKegiatan.insert(JSON.parse(fs.readFileSync(path.join("seeds", "BMKegiatanSeeder.json"), "utf8")));
    }
}

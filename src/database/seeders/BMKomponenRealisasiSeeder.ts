import 'module-alias/register';
import { BMKomponenRealisasi } from "@/app/models/BMKomponenRealisasi";
import fs from 'fs';
import path from 'path';

export class BMKomponenRealisasiSeeder {
    static async run() {
        await BMKomponenRealisasi.insert(JSON.parse(fs.readFileSync(path.join("seeds", "BMKomponenRealisasiSeeder.json"), "utf8")));
    }
}

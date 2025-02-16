import 'module-alias/register';
import { BMDetailSubkegiatan } from "@/app/models/BMDetailSubkegiatan";
import fs from 'fs';
import path from 'path';

export class BMDetailSubkegiatanSeeder {
    static async run() {
        await BMDetailSubkegiatan.insert(JSON.parse(fs.readFileSync(path.join("seeds", "BMDetailSubkegiatanSeeder.json"), "utf8")));
    }
}

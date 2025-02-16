import 'module-alias/register';
import { BMProgram } from "@/app/models/BMProgram";
import fs from 'fs';
import path from 'path';

export class BMProgramSeeder {
    static async run() {
        await BMProgram.insert(JSON.parse(fs.readFileSync(path.join("seeds", "BMProgramSeeder.json"), "utf8")));
    }
}

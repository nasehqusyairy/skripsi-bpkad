import 'module-alias/register';
import { Post } from "@/app/models/Post";
import fs from 'fs';
import path from 'path';

export class PostSeeder {
    static async run() {
        await Post.insert(JSON.parse(fs.readFileSync(path.join("seeds", "PostSeeder.json"), "utf8")));
    }
}

import 'module-alias/register';
import { Comment } from "@/app/models/Comment";
import fs from 'fs';
import path from 'path';

export class CommentSeeder {
    static async run() {
        await Comment.insert(JSON.parse(fs.readFileSync(path.join("seeds", "CommentSeeder.json"), "utf8")));
    }
}

import 'module-alias/register';
import { Post } from "@/app/models/Post";

export class PostSeeder {
    static async run() {
        await Post.insert([
    {
        "id": 1,
        "user_id": 1,
        "title": "Judul1",
        "content": "Lorem ipsum dolor sit amet",
        "created_at": "2025-02-11T08:29:37.000Z",
        "updated_at": "2025-02-11T08:29:37.000Z"
    }
]);
    }
}

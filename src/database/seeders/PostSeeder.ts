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
        "created_at": "2025-02-11T01:29:37.000Z",
        "updated_at": "2025-02-11T01:29:37.000Z"
    },
    {
        "id": 3,
        "user_id": 4,
        "title": "Post by Naseh",
        "content": "Lorem ipsum dolor sit amet pretium mollis felis dapibus eros maximus odio amet cursus vestibulum potenti erat pharetra elit ad integer suscipit hendrerit facilisi nostra at enim gravida pede dictum",
        "created_at": "2025-02-11T12:39:25.000Z",
        "updated_at": "2025-02-11T13:14:06.000Z"
    },
    {
        "id": 4,
        "user_id": 4,
        "title": "Post by Naseh 2",
        "content": " Lorem ipsum dolor sit amet dui scelerisque sagittis suscipit auctor senectus et proin interdum rhoncus penatibus taciti lacinia malesuada enim bibendum eget congue urna nisl nascetur hendrerit purus eu porta",
        "created_at": "2025-02-11T13:15:13.000Z",
        "updated_at": "2025-02-11T14:17:24.000Z"
    },
    {
        "id": 6,
        "user_id": 4,
        "title": "Post by Naseh 3",
        "content": "Lorem ipsum dolor sit amet magnis facilisis scelerisque ultricies maecenas libero quisque fermentum pretium taciti litora auctor molestie cursus phasellus sem class urna luctus curabitur sit porttitor in consectetur lectus",
        "created_at": "2025-02-11T15:41:05.000Z",
        "updated_at": "2025-02-11T15:41:05.000Z"
    },
    {
        "id": 7,
        "user_id": 4,
        "title": "Post by Naseh 4",
        "content": "Lorem ipsum dolor sit amet magnis facilisis scelerisque ultricies maecenas libero quisque fermentum pretium taciti litora auctor molestie cursus phasellus sem class urna luctus curabitur sit porttitor in consectetur lectus",
        "created_at": "2025-02-11T15:41:11.000Z",
        "updated_at": "2025-02-11T15:41:11.000Z"
    },
    {
        "id": 8,
        "user_id": 4,
        "title": "Post by Naseh 5",
        "content": "Lorem ipsum dolor sit amet magnis facilisis scelerisque ultricies maecenas libero quisque fermentum pretium taciti litora auctor molestie cursus phasellus sem class urna luctus curabitur sit porttitor in consectetur lectus",
        "created_at": "2025-02-11T15:41:19.000Z",
        "updated_at": "2025-02-11T15:41:19.000Z"
    },
    {
        "id": 9,
        "user_id": 4,
        "title": "Post by Naseh 6",
        "content": "Lorem ipsum dolor sit amet magnis facilisis scelerisque ultricies maecenas libero quisque fermentum pretium taciti litora auctor molestie cursus phasellus sem class urna luctus curabitur sit porttitor in consectetur lectus",
        "created_at": "2025-02-11T15:41:26.000Z",
        "updated_at": "2025-02-11T15:41:26.000Z"
    },
    {
        "id": 10,
        "user_id": 4,
        "title": "Post by Naseh 7",
        "content": "Lorem ipsum dolor sit amet magnis facilisis scelerisque ultricies maecenas libero quisque fermentum pretium taciti litora auctor molestie cursus phasellus sem class urna luctus curabitur sit porttitor in consectetur lectus",
        "created_at": "2025-02-11T15:42:11.000Z",
        "updated_at": "2025-02-11T15:42:11.000Z"
    }
]);
    }
}

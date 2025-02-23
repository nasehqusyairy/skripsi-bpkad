import { Model } from "@/utils/model/Model";
import { User } from "./User";
import { Post } from "./Post";

export interface IComment {
    id: number;
    user_id: number;
    post_id: number;
    body: string;
    created_at: string;
    updated_at: string;
}

export class Comment extends Model<IComment> {
    constructor() {
        super();
    }

    // Tambahkan relasi manual di sini jika diperlukan
    user() {
        return this.belongsTo(User, 'user_id');
    }

    post() {
        return this.belongsTo(Post, 'post_id');
    }
}

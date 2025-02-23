import { Model } from "@/utils/model/Model";
import { User } from "./User";
import { Comment } from "./Comment";

export interface IPost {
    id: number;
    user_id: number;
    title?: string;
    content?: string;
    created_at: string;
    updated_at: string;
}

export class Post extends Model<IPost> {
    constructor() {
        super();
    }

    // Tambahkan relasi manual di sini jika diperlukan
    user() {
        return this.belongsTo(User);
    }

    comments() {
        return this.hasMany(Comment);
    }
}

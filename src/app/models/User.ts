import { Model } from "@/utils/model/Model";
import { Comment, IComment } from "./Comment";
import { Post, IPost } from "./Post";

export interface IUser {
    id: number;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
    comments?: (Comment & IComment)[];
    posts?: (Post & IPost)[];
}

export class User extends Model<IUser> {
    constructor() {
        super();
    }
    
    
    // Tambahkan relasi manual di sini jika diperlukan
    comments() {
        return this.hasMany(Comment);
    }

    posts() {
        return this.hasMany(Post);
    }
}

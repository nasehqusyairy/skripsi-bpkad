import { Model } from "@/utils/model/Model";
import { User, IUser } from "./User";
import { Post, IPost } from "./Post";

export interface IComment {
    id: number;
    user_id: number;
    post_id: number;
    body: string;
    created_at: string;
    updated_at: string;
    user?: User & IUser;
    post?: Post & IPost;
}

export class Comment extends Model<IComment> {
    constructor() {
        super();
    }
    
    
    // Tambahkan relasi manual di sini jika diperlukan
    user() {
        return this.belongsTo(User);
    }

    post() {
        return this.belongsTo(Post);
    }
}

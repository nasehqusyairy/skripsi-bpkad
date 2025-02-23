import { Model } from "@/utils/model/Model";
import { User, IUser } from "./User";

export interface IPost {
    id: number;
    user_id: number;
    title?: string;
    content?: string;
    created_at: string;
    updated_at: string;
    user?: User & IUser;
}

export class Post extends Model<IPost> {
    constructor() {
        super();
    }
    
    
    // Tambahkan relasi manual di sini jika diperlukan
    user() {
        return this.belongsTo(User);
    }
}

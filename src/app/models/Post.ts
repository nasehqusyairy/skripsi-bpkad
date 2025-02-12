import { Model } from "@/utils/model/Model";
import { User } from "./User";

export interface IPost {
    id: number;
    user_id: number;
    title?: string;
    content?: string;
    created_at: string;
    updated_at: string;
}

export class Post extends Model<IPost> implements IPost {
    constructor(attributes: Partial<IPost> = {}) {
        super(attributes);
    }
    id: number;
    user_id: number;
    title?: string;
    content?: string;
    created_at: string;
    updated_at: string;

    // Tambahkan relasi manual di sini jika diperlukan
    user() {
        return this.belongsTo(User, 'user_id');
    }
}

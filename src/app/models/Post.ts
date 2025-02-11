import { Model } from "@/utils/model/Model";
import { User } from "./User";

export interface IPost {
    id: number;
    user_id: number;
    title?: string;
    content?: string;
    created_at: Date;
    updated_at: Date;
}

export class Post extends Model<IPost> {
    constructor(attributes: Partial<IPost>) {
        super(attributes);
    }

    // Tambahkan relasi manual di sini jika diperlukan
    public user() {
        return this.belongsTo(User, 'user_id');
    }
}

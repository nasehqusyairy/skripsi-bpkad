import { Model } from "@/utils/model/Model";
import { Post } from "./Post";
import { Role } from "./Role";

export interface IUser {
    id: number;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
}

export class User extends Model<IUser> {
    constructor(attributes: Partial<IUser> = {}) {
        super(attributes);
    }

    protected hidden = ['password'];

    // Tambahkan relasi manual di sini jika diperlukan
    posts() {
        return this.hasMany(Post, 'user_id');
    }

    roles() {
        return this.belongsToMany(Role, 'role_user');
    }
}

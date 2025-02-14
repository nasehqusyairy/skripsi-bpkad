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

export class User extends Model<IUser> implements IUser {
    constructor(attributes: Partial<IUser> = {}) {
        super(attributes);
    }

    // implementasi interface
    id: number;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;

    // Tambahkan relasi manual di sini jika diperlukan
    posts() {
        return this.hasMany(Post, 'user_id');
    }

    roles() {
        return this.belongsToMany(Role, 'role_user');
    }
}

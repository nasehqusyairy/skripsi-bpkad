import { Model } from "@/utils/model/Model";
import { IPost, Post } from "./Post";
import { IRole, Role } from "./Role";

export interface IUser {
    id: number;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;

    roles?: (Role & IRole)[];
    posts?: (Post & IPost)[];
}

export class User extends Model<IUser> {
    constructor() {
        super();
    }

    // Tambahkan relasi manual di sini jika diperlukan
    roles() {
        return this.belongsToMany(Role, 'role_user');
    }

    posts() {
        return this.hasMany(Post);
    }
}

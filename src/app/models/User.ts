import { Model } from "@/utils/model/Model";
import { Role } from "./Role";

export interface IUser {
    id: number;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}

export class User extends Model<IUser> {
    constructor(attributes: Partial<IUser>) {
        super(attributes);
    }

    protected hidden: string[] = ['password'];

    // Tambahkan relasi manual di sini jika diperlukan
    public roles() {
        return this.belongsToMany(Role, 'role_user', 'user_id', 'role_id');
    }
}

import { Model } from "@/utils/model/Model";

export interface IRole {
    id: number;
    name?: string;
    created_at: Date;
    updated_at: Date;
}

export class Role extends Model<IRole> {
    constructor(attributes: Partial<IRole>) {
        super(attributes);
    }

    // Tambahkan relasi manual di sini jika diperlukan
}

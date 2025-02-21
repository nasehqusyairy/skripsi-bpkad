import { Model } from "@/utils/model/Model";


export interface IRole {
    id: number;
    name?: string;
    created_at: string;
    updated_at: string;
}

export class Role extends Model<IRole> implements IRole {
    constructor(attributes: Partial<IRole> = {}) {
        super(attributes);
    }
    
    // implementasi interface
        id: number;
    name?: string;
    created_at: string;
    updated_at: string;

    // Tambahkan relasi manual di sini jika diperlukan
    
}

import { Model } from "@/utils/model/Model";


export interface IRole {
    id: number;
    name?: string;
    created_at: string;
    updated_at: string;
}

export class Role extends Model<IRole> {
    constructor() {
        super();
    }
    
    
    // Tambahkan relasi manual di sini jika diperlukan
    
}

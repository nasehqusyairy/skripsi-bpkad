import { Model } from "@/utils/model/Model";


export interface IMTahapan {
    id: number;
    tahun_buku: number;
    posisi?: number;
    nama?: string;
    jenis?: string;
    insert_date?: string;
    insert_by?: string;
    is_used: number;
    is_used_belanja: number;
}

export class MTahapan extends Model<IMTahapan> {
    constructor() {
        super();
    }
    
    protected tableName = "m_tahapan";

    
    // Tambahkan relasi manual di sini jika diperlukan
    
}

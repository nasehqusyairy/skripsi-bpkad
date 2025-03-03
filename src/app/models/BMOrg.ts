import { Model } from "@/utils/model/Model";


export interface IBMOrg {
    id_org: number;
    tahun_buku: number;
    kode_org?: string;
    nama_org?: string;
    kode_lama?: string;
    nama_lama?: string;
    is_bagian?: number;
    is_tapd?: number;
    attrs?: any;
    insert_date?: string;
    insert_by?: string;
}

export class BMOrg extends Model<IBMOrg> {
    constructor() {
        super();
    }
    
    protected tableName = "b_m_org";

    
    protected primaryKey = "id_org";

    // Tambahkan relasi manual di sini jika diperlukan
    
}

import { Model } from "@/utils/model/Model";


export interface IBMSshbd {
    id_sshbd: number;
    tahun_buku: number;
    kode_sshbd: string;
    nama_sshbd: string;
    satuan_sshbd: string;
    harga_sshbd: any;
    kenaikan_gapok: number;
    harga_editable?: number;
    insert_date?: string;
    insert_by?: string;
}

export class BMSshbd extends Model<IBMSshbd> {
    constructor() {
        super();
    }
    
    protected tableName = "b_m_sshbd";

    
    protected primaryKey = "id_sshbd";

    // Tambahkan relasi manual di sini jika diperlukan
    
}

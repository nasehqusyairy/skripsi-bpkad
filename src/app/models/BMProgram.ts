import { Model } from "@/utils/model/Model";


export interface IBMProgram {
    id_program: number;
    tahun_buku: number;
    id_rpjmd: number;
    kode_program?: string;
    nama_program?: string;
    insert_date?: string;
    insert_by?: string;
}

export class BMProgram extends Model<IBMProgram> {
    constructor() {
        super();
    }
    
    protected tableName = "b_m_program";

    
    protected primaryKey = "id_program";

    // Tambahkan relasi manual di sini jika diperlukan
    
}

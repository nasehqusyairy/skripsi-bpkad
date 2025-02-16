import { Model } from "@/utils/model/Model";


export interface IBMProgram {
    id: number;
    id_program: number;
    tahun_buku: number;
    id_rpjmd: number;
    kode_program?: string;
    nama_program?: string;
    insert_date?: string;
    insert_by?: string;
}

export class BMProgram extends Model<IBMProgram> implements IBMProgram {
    constructor(attributes: Partial<IBMProgram> = {}) {
        super(attributes);
    }

    protected tableName = "b_m_program";

    // implementasi interface
    id: number;
    id_program: number;
    tahun_buku: number;
    id_rpjmd: number;
    kode_program?: string;
    nama_program?: string;
    insert_date?: string;
    insert_by?: string;

    // Tambahkan relasi manual di sini jika diperlukan

}

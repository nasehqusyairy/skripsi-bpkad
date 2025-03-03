import { Model } from "@/utils/model/Model";
import { BMKomponen, IBMKomponen } from "./BMKomponen";


export interface IBMSubkegiatan {
    id_subkegiatan: number;
    tahun_buku: number;
    id_kegiatan: number;
    id_subkegiatan_global?: number;
    kode_subkegiatan?: string;
    nama_subkegiatan?: string;
    keterangan?: string;
    jenis?: string;
    is_active?: number;
    insert_date?: string;
    insert_by?: string;

    komponen: (BMKomponen & IBMKomponen)[]
}

export class BMSubkegiatan extends Model<IBMSubkegiatan> {
    constructor() {
        super();
    }

    protected tableName = "b_m_subkegiatan";


    protected primaryKey = "id_subkegiatan";

    // Tambahkan relasi manual di sini jika diperlukan
    komponen() {
        return this.hasMany(BMKomponen, 'id_subkegiatan')
    }

}

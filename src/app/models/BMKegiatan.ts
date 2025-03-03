import { Model } from "@/utils/model/Model";
import { BMSubkegiatan, IBMSubkegiatan } from "./BMSubkegiatan";


export interface IBMKegiatan {
    id_kegiatan: number;
    tahun_buku: number;
    id_org: number;
    id_program?: number;
    kode_kegiatan?: string;
    nama_kegiatan?: string;
    keterangan?: string;
    jenis?: string;
    is_active?: number;
    insert_date?: string;
    insert_by?: string;

    subkegiatan: (BMSubkegiatan & IBMSubkegiatan)[];
    total_anggaran?: number;
}

export class BMKegiatan extends Model<IBMKegiatan> {
    constructor() {
        super();
    }

    protected tableName = "b_m_kegiatan";


    protected primaryKey = "id_kegiatan";

    // Tambahkan relasi manual di sini jika diperlukan
    subkegiatan() {
        return this.hasMany(BMSubkegiatan, 'id_kegiatan')
    }

}

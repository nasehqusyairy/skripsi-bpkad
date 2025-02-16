import { Model } from "@/utils/model/Model";


export interface IBMSubkegiatan {
    id: number;
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
}

export class BMSubkegiatan extends Model<IBMSubkegiatan> implements IBMSubkegiatan {
    constructor(attributes: Partial<IBMSubkegiatan> = {}) {
        super(attributes);
    }

    protected tableName = "b_m_subkegiatan";

    // implementasi interface
    id: number;
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

    // Tambahkan relasi manual di sini jika diperlukan

}

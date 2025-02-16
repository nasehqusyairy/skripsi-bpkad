import { Model } from "@/utils/model/Model";


export interface IBMKegiatan {
    id: number;
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
}

export class BMKegiatan extends Model<IBMKegiatan> implements IBMKegiatan {
    constructor(attributes: Partial<IBMKegiatan> = {}) {
        super(attributes);
    }

    protected tableName = "b_m_kegiatan";

    // implementasi interface
    id: number;
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

    // Tambahkan relasi manual di sini jika diperlukan

}

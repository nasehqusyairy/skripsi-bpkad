import { Model } from "@/utils/model/Model";
import { BMKomponenRealisasi } from "./BMKomponenRealisasi";


export interface IBMKomponen {
    id_komponen: number;
    tahun_buku: number;
    id_tahapan: number;
    id_subrincian: number;
    id_subtitle?: number;
    id_sshbd: number;
    id_subkegiatan: number;
    id_log_impor?: number;
    id_komponen_parent?: number;
    kode_detail_kegiatan?: string;
    nomor?: number;
    volume?: any;
    acress?: any;
    koefisien?: string;
    harga_satuan?: any;
    jumlah_total?: any;
    label?: string;
    ket?: any;
    penanda?: any;
    enabled?: number;
    jumlah_pasangan?: number;
    jumlah_anak?: number;
    pajak?: number;
    sumber_dana?: string;
    insert_date?: string;
    insert_by?: string;
    id_sumber_dana?: number;
}

export class BMKomponen extends Model<IBMKomponen> {
    constructor() {
        super();
    }

    protected tableName = "b_m_komponen";


    protected primaryKey = "id_komponen";

    // Tambahkan relasi manual di sini jika diperlukan
    komponenRealisasi() {
        return this.hasMany(BMKomponenRealisasi, 'id_komponen')
    }

}

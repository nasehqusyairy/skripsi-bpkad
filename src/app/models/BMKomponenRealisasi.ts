import { Model } from "@/utils/model/Model";


export interface IBMKomponenRealisasi {
    id_realisasi_komponen: number;
    tahun_buku: number;
    id_tahapan: number;
    id_tahapan_edelivery: number;
    id_komponen: number;
    id_transaksi: number;
    kode_detail_kegiatan: string;
    nilai_anggaran?: any;
    sumber_dana?: string;
    status: string;
    tanggal: any;
    nomor_sp2d?: string;
    nilai_realisasi: any;
    volume_realisasi: any;
    lpj_up?: string;
    lpj_up_tanggal?: any;
    insert_date: string;
    id_pekerjaan?: number;
}

export class BMKomponenRealisasi extends Model<IBMKomponenRealisasi> {
    constructor() {
        super();
    }
    
    protected tableName = "b_m_komponen_realisasi";

    
    protected primaryKey = "id_realisasi_komponen";

    // Tambahkan relasi manual di sini jika diperlukan
    
}

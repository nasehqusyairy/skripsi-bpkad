import { Model } from "@/utils/model/Model";


export interface IBMKomponenRealisasi {
    id: number;
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

export class BMKomponenRealisasi extends Model<IBMKomponenRealisasi> implements IBMKomponenRealisasi {
    constructor(attributes: Partial<IBMKomponenRealisasi> = {}) {
        super(attributes);
    }

    protected tableName = "b_m_komponen_realisasi";

    // implementasi interface
    id: number;
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

    // Tambahkan relasi manual di sini jika diperlukan

}

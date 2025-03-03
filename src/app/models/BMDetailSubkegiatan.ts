import { Model } from "@/utils/model/Model";


export interface IBMDetailSubkegiatan {
    id_tahapan: number;
    id_subkegiatan: number;
    tahun_buku: number;
    nama_detail_subkegiatan?: string;
    ket_detail_subkegiatan?: string;
    lokasi_detail_subkegiatan?: string;
    sumber_dana_detail_subkegiatan?: string;
    waktu_pelaksanaan?: string;
    tolok1?: string;
    target1?: string;
    tolok2?: string;
    target2?: string;
    tolok3?: string;
    target3?: string;
    tolok4?: string;
    target4?: string;
    tolok5?: string;
    target5?: string;
    kelompok_sasaran?: string;
    ket_perubahan?: string;
    realisasi_tw1?: string;
    realisasi_tw2?: string;
    realisasi_tw3?: string;
    realisasi_tw4?: string;
    realisasi_satuan?: string;
}

export class BMDetailSubkegiatan extends Model<IBMDetailSubkegiatan> {
    constructor() {
        super();
    }
    
    protected tableName = "b_m_detail_subkegiatan";

    
    protected primaryKey = "id_tahapan";

    // Tambahkan relasi manual di sini jika diperlukan
    
}

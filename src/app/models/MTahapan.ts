import { Model } from "@/utils/model/Model";


export interface IMTahapan {
    id_tahapan: number;
    id: number;
    tahun_buku: number;
    posisi?: number;
    nama?: string;
    jenis?: string;
    insert_date?: string;
    insert_by?: string;
    is_used: number;
    is_used_belanja: number;
}

export class MTahapan extends Model<IMTahapan> implements IMTahapan {
    constructor(attributes: Partial<IMTahapan> = {}) {
        super(attributes);
    }

    protected tableName = "m_tahapan";

    // implementasi interface
    id_tahapan: number;
    id: number;
    tahun_buku: number;
    posisi?: number;
    nama?: string;
    jenis?: string;
    insert_date?: string;
    insert_by?: string;
    is_used: number;
    is_used_belanja: number;

    // Tambahkan relasi manual di sini jika diperlukan

}

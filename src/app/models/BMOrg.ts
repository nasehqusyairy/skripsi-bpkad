import { Model } from "@/utils/model/Model";


export interface IBMOrg {
    id: number;
    id_org: number;
    tahun_buku: number;
    kode_org?: string;
    nama_org?: string;
    kode_lama?: string;
    nama_lama?: string;
    is_bagian?: number;
    is_tapd?: number;
    attrs?: any;
    insert_date?: string;
    insert_by?: string;
}

export class BMOrg extends Model<IBMOrg> implements IBMOrg {
    constructor(attributes: Partial<IBMOrg> = {}) {
        super(attributes);
    }

    protected tableName = "b_m_org";

    // implementasi interface
    id: number;
    id_org: number;
    tahun_buku: number;
    kode_org?: string;
    nama_org?: string;
    kode_lama?: string;
    nama_lama?: string;
    is_bagian?: number;
    is_tapd?: number;
    attrs?: any;
    insert_date?: string;
    insert_by?: string;

    // Tambahkan relasi manual di sini jika diperlukan

}

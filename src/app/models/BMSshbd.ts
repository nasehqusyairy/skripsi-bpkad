import { Model } from "@/utils/model/Model";


export interface IBMSshbd {
    id: number;
    id_sshbd: number;
    tahun_buku: number;
    kode_sshbd: string;
    nama_sshbd: string;
    satuan_sshbd: string;
    harga_sshbd: any;
    kenaikan_gapok: number;
    harga_editable?: number;
    insert_date?: string;
    insert_by?: string;
}

export class BMSshbd extends Model<IBMSshbd> implements IBMSshbd {
    constructor(attributes: Partial<IBMSshbd> = {}) {
        super(attributes);
    }

    protected tableName = "b_m_sshbd";

    // implementasi interface
    id: number;
    id_sshbd: number;
    tahun_buku: number;
    kode_sshbd: string;
    nama_sshbd: string;
    satuan_sshbd: string;
    harga_sshbd: any;
    kenaikan_gapok: number;
    harga_editable?: number;
    insert_date?: string;
    insert_by?: string;

    // Tambahkan relasi manual di sini jika diperlukan

}

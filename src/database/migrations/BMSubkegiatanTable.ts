import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class BMSubkegiatanTable {
    static async up() {
        await Schema.create('b_m_subkegiatan', (table) => {
            table.id();
            table.integer('id_subkegiatan')
            table.integer('tahun_buku')
            table.integer('id_kegiatan');
            table.bigint('id_subkegiatan_global').nullable();
            table.string('kode_subkegiatan').nullable();
            table.string('nama_subkegiatan').nullable();
            table.string('keterangan').nullable();
            table.string('jenis').nullable();
            table.string('is_active').nullable();
            table.timestamp('insert_date').nullable().default('CURRENT_TIMESTAMP', true);
            table.string('insert_by').nullable().default('MASTER_KEY', false);
        });
    }

    static async down() {
        await Schema.drop('b_m_subkegiatan');
    }
}
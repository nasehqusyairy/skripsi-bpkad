import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class BMKegiatanTable {
    static async up() {
        await Schema.create('b_m_kegiatan', (table) => {
            table.id();
            table.integer('id_kegiatan')
            table.integer('tahun_buku')
            table.integer('id_org');
            table.integer('id_program').nullable();
            table.string('kode_kegiatan').nullable();
            table.string('nama_kegiatan').nullable();
            table.string('keterangan').nullable();
            table.string('jenis').nullable();
            table.string('is_active').nullable();
            table.timestamp('insert_date').nullable().default('CURRENT_TIMESTAMP', true);
            table.string('insert_by').nullable().default('MASTER_KEY', false);
        });
    }

    static async down() {
        await Schema.drop('b_m_kegiatan');
    }
}
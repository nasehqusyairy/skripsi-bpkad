import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class BMOrgTable {
    static async up() {
        await Schema.create('b_m_org', (table) => {
            table.id();
            table.integer('id_org')
            table.integer('tahun_buku')
            table.string('kode_org').nullable();
            table.string('nama_org').nullable();
            table.string('kode_lama').nullable();
            table.string('nama_lama').nullable();
            table.string('is_bagian').nullable();
            table.string('is_tapd').nullable();
            table.string('attrs').nullable();
            table.timestamp('insert_date').nullable().default('CURRENT_TIMESTAMP', true);
            table.string('insert_by').nullable().default('MASTER', false);
        });
    }

    static async down() {
        await Schema.drop('b_m_org');
    }
}
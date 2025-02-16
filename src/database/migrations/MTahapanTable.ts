import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class MTahapanTable {
    static async up() {
        await Schema.create('m_tahapan', (table) => {
            table.integer('id_tahapan').primary().autoIncrement();
            table.integer('id')
            table.integer('tahun_buku')
            table.integer('posisi').nullable();
            table.string('nama').nullable();
            table.string('jenis').nullable();
            table.timestamp('insert_date').nullable().default('CURRENT_TIMESTAMP', true);
            table.string('insert_by').nullable().default('MASTER', false);
            table.string('is_used').default('0', false);
            table.string('is_used_belanja');
        });
    }

    static async down() {
        await Schema.drop('m_tahapan');
    }
}
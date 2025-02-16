import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class BMProgramTable {
    static async up() {
        await Schema.create('b_m_program', (table) => {
            table.id();
            table.integer('id_program')
            table.integer('tahun_buku')
            table.integer('id_rpjmd');
            table.string('kode_program').nullable();
            table.string('nama_program').nullable();
            table.timestamp('insert_date').nullable().default('CURRENT_TIMESTAMP', true);
            table.string('insert_by').nullable().default('MASTER_KEY', false);
        });
    }

    static async down() {
        await Schema.drop('b_m_program');
    }
}
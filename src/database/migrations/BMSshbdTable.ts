import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class BMSshbdTable {
    static async up() {
        await Schema.create('b_m_sshbd', (table) => {
            table.id();
            table.integer('id_sshbd')
            table.integer('tahun_buku')
            table.string('kode_sshbd');
            table.text('nama_sshbd');
            table.string('satuan_sshbd');
            table.string('harga_sshbd');
            table.integer('kenaikan_gapok');
            table.string('harga_editable').nullable();
            table.timestamp('insert_date').nullable().default('CURRENT_TIMESTAMP', true);
            table.string('insert_by').nullable().default('MASTER_KEY', false);
        });
    }

    static async down() {
        await Schema.drop('b_m_sshbd');
    }
}
import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class BMKomponenTable {
    static async up() {
        await Schema.create('b_m_komponen', (table) => {
            table.id();
            table.integer('id_komponen')
            table.integer('tahun_buku')
            table.integer('id_tahapan');
            table.integer('id_subrincian');
            table.integer('id_subtitle').nullable();
            table.integer('id_sshbd');
            table.integer('id_subkegiatan');
            table.bigint('id_log_impor').nullable();
            table.bigint('id_komponen_parent').nullable();
            table.string('kode_detail_kegiatan').nullable();
            table.integer('nomor').nullable();
            table.string('volume').nullable();
            table.string('acress').nullable();
            table.text('koefisien').nullable();
            table.string('harga_satuan').nullable();
            table.string('jumlah_total').nullable();
            table.text('label').nullable();
            table.string('ket').nullable();
            table.string('penanda').nullable();
            table.string('enabled').nullable();
            table.integer('jumlah_pasangan').nullable();
            table.integer('jumlah_anak').nullable();
            table.integer('pajak').nullable();
            table.string('sumber_dana').nullable();
            table.timestamp('insert_date').nullable().default('CURRENT_TIMESTAMP', true);
            table.string('insert_by').nullable().default('MASTER_KEY', false);
            table.integer('id_sumber_dana').nullable();
        });
    }

    static async down() {
        await Schema.drop('b_m_komponen');
    }
}
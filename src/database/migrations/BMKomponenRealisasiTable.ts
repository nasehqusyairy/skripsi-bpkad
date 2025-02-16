import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class BMKomponenRealisasiTable {
    static async up() {
        await Schema.create('b_m_komponen_realisasi', (table) => {
            table.id();
            table.bigint('id_realisasi_komponen')
            table.integer('tahun_buku')
            table.integer('id_tahapan');
            table.integer('id_tahapan_edelivery');
            table.integer('id_komponen');
            table.integer('id_transaksi');
            table.string('kode_detail_kegiatan');
            table.string('nilai_anggaran').nullable();
            table.string('sumber_dana').nullable();
            table.string('status');
            table.string('tanggal');
            table.string('nomor_sp2d').nullable();
            table.string('nilai_realisasi');
            table.string('volume_realisasi');
            table.string('lpj_up').nullable();
            table.string('lpj_up_tanggal').nullable();
            table.timestamp('insert_date').default('CURRENT_TIMESTAMP', true);
            table.bigint('id_pekerjaan').nullable();
        });
    }

    static async down() {
        await Schema.drop('b_m_komponen_realisasi');
    }
}
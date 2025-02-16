import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class BMDetailSubkegiatanTable {
    static async up() {
        await Schema.create('b_m_detail_subkegiatan', (table) => {
            table.id();
            table.integer('id_tahapan');
            table.integer('id_subkegiatan');
            table.integer('tahun_buku');
            table.text('nama_detail_subkegiatan').nullable();
            table.text('ket_detail_subkegiatan').nullable();
            table.text('lokasi_detail_subkegiatan').nullable();
            table.text('sumber_dana_detail_subkegiatan').nullable();
            table.text('waktu_pelaksanaan').nullable();
            table.text('tolok1').nullable();
            table.text('target1').nullable();
            table.text('tolok2').nullable();
            table.text('target2').nullable();
            table.text('tolok3').nullable();
            table.text('target3').nullable();
            table.text('tolok4').nullable();
            table.text('target4').nullable();
            table.text('tolok5').nullable();
            table.text('target5').nullable();
            table.text('kelompok_sasaran').nullable();
            table.text('ket_perubahan').nullable();
            table.text('realisasi_tw1').nullable();
            table.text('realisasi_tw2').nullable();
            table.text('realisasi_tw3').nullable();
            table.text('realisasi_tw4').nullable();
            table.text('realisasi_satuan').nullable();
        });
    }

    static async down() {
        await Schema.drop('b_m_detail_subkegiatan');
    }
}
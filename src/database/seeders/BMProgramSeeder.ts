import 'module-alias/register';
import { BMProgram } from "@/app/models/BMProgram";

export class BMProgramSeeder {
    static async run() {
        await BMProgram.insert([
    {
        "id_program": 1,
        "tahun_buku": 2022,
        "id_rpjmd": 4,
        "kode_program": "1.01.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 1,
        "tahun_buku": 2023,
        "id_rpjmd": 24,
        "kode_program": "3.25.04",
        "nama_program": "PROGRAM PENGELOLAAN PERIKANAN BUDIDAYA",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 1,
        "tahun_buku": 2024,
        "id_rpjmd": 24,
        "kode_program": "3.25.04",
        "nama_program": "PROGRAM PENGELOLAAN PERIKANAN BUDIDAYA",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 2,
        "tahun_buku": 2022,
        "id_rpjmd": 4,
        "kode_program": "1.01.02",
        "nama_program": "PROGRAM PENGELOLAAN PENDIDIKAN",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 2,
        "tahun_buku": 2023,
        "id_rpjmd": 5,
        "kode_program": "1.05.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 2,
        "tahun_buku": 2024,
        "id_rpjmd": 5,
        "kode_program": "1.05.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 3,
        "tahun_buku": 2022,
        "id_rpjmd": 4,
        "kode_program": "1.01.04",
        "nama_program": "PROGRAM PENDIDIK DAN TENAGA KEPENDIDIKAN",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 3,
        "tahun_buku": 2023,
        "id_rpjmd": 12,
        "kode_program": "2.12.03",
        "nama_program": "PROGRAM PENCATATAN SIPIL",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 3,
        "tahun_buku": 2024,
        "id_rpjmd": 12,
        "kode_program": "2.12.03",
        "nama_program": "PROGRAM PENCATATAN SIPIL",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 4,
        "tahun_buku": 2022,
        "id_rpjmd": 5,
        "kode_program": "1.02.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 4,
        "tahun_buku": 2023,
        "id_rpjmd": 26,
        "kode_program": "3.27.07",
        "nama_program": "PROGRAM PENYULUHAN PERTANIAN",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 4,
        "tahun_buku": 2024,
        "id_rpjmd": 26,
        "kode_program": "3.27.07",
        "nama_program": "PROGRAM PENYULUHAN PERTANIAN",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 5,
        "tahun_buku": 2022,
        "id_rpjmd": 5,
        "kode_program": "1.02.02",
        "nama_program": "PROGRAM PEMENUHAN UPAYA KESEHATAN PERORANGAN DAN UPAYA KESEHATAN MASYARAKAT",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 5,
        "tahun_buku": 2023,
        "id_rpjmd": 16,
        "kode_program": "2.17.05",
        "nama_program": "PROGRAM PENDIDIKAN DAN LATIHAN PERKOPERASIAN",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 5,
        "tahun_buku": 2024,
        "id_rpjmd": 16,
        "kode_program": "2.17.05",
        "nama_program": "PROGRAM PENDIDIKAN DAN LATIHAN PERKOPERASIAN",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 6,
        "tahun_buku": 2022,
        "id_rpjmd": 5,
        "kode_program": "1.02.03",
        "nama_program": "PROGRAM PENINGKATAN KAPASITAS SUMBER DAYA MANUSIA KESEHATAN",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 6,
        "tahun_buku": 2023,
        "id_rpjmd": 16,
        "kode_program": "2.17.07",
        "nama_program": "PROGRAM PEMBERDAYAAN USAHA MENENGAH, USAHA KECIL, DAN USAHA MIKRO (UMKM)",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 6,
        "tahun_buku": 2024,
        "id_rpjmd": 16,
        "kode_program": "2.17.07",
        "nama_program": "PROGRAM PEMBERDAYAAN USAHA MENENGAH, USAHA KECIL, DAN USAHA MIKRO (UMKM)",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 7,
        "tahun_buku": 2022,
        "id_rpjmd": 5,
        "kode_program": "1.02.04",
        "nama_program": "PROGRAM SEDIAAN FARMASI, ALAT KESEHATAN DAN MAKANAN MINUMAN",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 7,
        "tahun_buku": 2023,
        "id_rpjmd": 11,
        "kode_program": "2.11.04",
        "nama_program": "PROGRAM PENGELOLAAN KEANEKARAGAMAN HAYATI (KEHATI)",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 7,
        "tahun_buku": 2024,
        "id_rpjmd": 11,
        "kode_program": "2.11.04",
        "nama_program": "PROGRAM PENGELOLAAN KEANEKARAGAMAN HAYATI (KEHATI)",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 8,
        "tahun_buku": 2022,
        "id_rpjmd": 5,
        "kode_program": "1.02.05",
        "nama_program": "PROGRAM PEMBERDAYAAN MASYARAKAT BIDANG KESEHATAN",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 8,
        "tahun_buku": 2023,
        "id_rpjmd": 2,
        "kode_program": "1.02.05",
        "nama_program": "PROGRAM PEMBERDAYAAN MASYARAKAT BIDANG KESEHATAN",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 8,
        "tahun_buku": 2024,
        "id_rpjmd": 2,
        "kode_program": "1.02.05",
        "nama_program": "PROGRAM PEMBERDAYAAN MASYARAKAT BIDANG KESEHATAN",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 9,
        "tahun_buku": 2022,
        "id_rpjmd": 6,
        "kode_program": "1.03.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 9,
        "tahun_buku": 2023,
        "id_rpjmd": 32,
        "kode_program": "5.02.03",
        "nama_program": "PROGRAM PENGELOLAAN BARANG MILIK DAERAH",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 9,
        "tahun_buku": 2024,
        "id_rpjmd": 32,
        "kode_program": "5.02.03",
        "nama_program": "PROGRAM PENGELOLAAN BARANG MILIK DAERAH",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 10,
        "tahun_buku": 2022,
        "id_rpjmd": 6,
        "kode_program": "1.03.02",
        "nama_program": "PROGRAM PENGELOLAAN SUMBER DAYA AIR (SDA)",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 10,
        "tahun_buku": 2023,
        "id_rpjmd": 7,
        "kode_program": "2.07.05",
        "nama_program": "PROGRAM HUBUNGAN INDUSTRIAL",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 10,
        "tahun_buku": 2024,
        "id_rpjmd": 7,
        "kode_program": "2.07.05",
        "nama_program": "PROGRAM HUBUNGAN INDUSTRIAL",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 11,
        "tahun_buku": 2022,
        "id_rpjmd": 6,
        "kode_program": "1.03.03",
        "nama_program": "PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM PENYEDIAAN AIR MINUM",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 11,
        "tahun_buku": 2023,
        "id_rpjmd": 38,
        "kode_program": "8.01.05",
        "nama_program": "PROGRAM PEMBINAAN DAN PENGEMBANGAN KETAHANAN EKONOMI, SOSIAL, DAN BUDAYA",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 11,
        "tahun_buku": 2024,
        "id_rpjmd": 38,
        "kode_program": "8.01.05",
        "nama_program": "PROGRAM PEMBINAAN DAN PENGEMBANGAN KETAHANAN EKONOMI, SOSIAL, DAN BUDAYA",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 12,
        "tahun_buku": 2022,
        "id_rpjmd": 6,
        "kode_program": "1.03.05",
        "nama_program": "PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM AIR LIMBAH",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 12,
        "tahun_buku": 2023,
        "id_rpjmd": 38,
        "kode_program": "8.01.03",
        "nama_program": "PROGRAM PENINGKATAN PERAN PARTAI POLITIK DAN LEMBAGA PENDIDIKAN MELALUI PENDIDIKAN POLITIK DAN PENGEMBANGAN ETIKA SERTA BUDAYA POLITIK",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 12,
        "tahun_buku": 2024,
        "id_rpjmd": 38,
        "kode_program": "8.01.03",
        "nama_program": "PROGRAM PENINGKATAN PERAN PARTAI POLITIK DAN LEMBAGA PENDIDIKAN MELALUI PENDIDIKAN POLITIK DAN PENGEMBANGAN ETIKA SERTA BUDAYA POLITIK",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 13,
        "tahun_buku": 2022,
        "id_rpjmd": 6,
        "kode_program": "1.03.06",
        "nama_program": "PROGRAM PENGELOLAAN DAN PENGEMBANGAN SISTEM DRAINASE",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 13,
        "tahun_buku": 2023,
        "id_rpjmd": 6,
        "kode_program": "1.06.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 13,
        "tahun_buku": 2024,
        "id_rpjmd": 6,
        "kode_program": "1.06.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 14,
        "tahun_buku": 2022,
        "id_rpjmd": 6,
        "kode_program": "1.03.07",
        "nama_program": "PROGRAM PENGEMBANGAN PERMUKIMAN",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 14,
        "tahun_buku": 2023,
        "id_rpjmd": 9,
        "kode_program": "2.09.05",
        "nama_program": "PROGRAM PENGAWASAN KEAMANAN PANGAN",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 14,
        "tahun_buku": 2024,
        "id_rpjmd": 9,
        "kode_program": "2.09.05",
        "nama_program": "PROGRAM PENGAWASAN KEAMANAN PANGAN",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 15,
        "tahun_buku": 2022,
        "id_rpjmd": 6,
        "kode_program": "1.03.08",
        "nama_program": "PROGRAM PENATAAN BANGUNAN GEDUNG",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 15,
        "tahun_buku": 2023,
        "id_rpjmd": 3,
        "kode_program": "1.03.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 15,
        "tahun_buku": 2024,
        "id_rpjmd": 3,
        "kode_program": "1.03.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 16,
        "tahun_buku": 2022,
        "id_rpjmd": 6,
        "kode_program": "1.03.10",
        "nama_program": "PROGRAM PENYELENGGARAAN JALAN",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 16,
        "tahun_buku": 2023,
        "id_rpjmd": 6,
        "kode_program": "1.06.07",
        "nama_program": "PROGRAM PENGELOLAAN TAMAN MAKAM PAHLAWAN",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 16,
        "tahun_buku": 2024,
        "id_rpjmd": 6,
        "kode_program": "1.06.07",
        "nama_program": "PROGRAM PENGELOLAAN TAMAN MAKAM PAHLAWAN",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 17,
        "tahun_buku": 2022,
        "id_rpjmd": 6,
        "kode_program": "1.03.11",
        "nama_program": "PROGRAM PENGEMBANGAN JASA KONSTRUKSI",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 17,
        "tahun_buku": 2023,
        "id_rpjmd": 29,
        "kode_program": "4.01.03",
        "nama_program": "PROGRAM PEREKONOMIAN DAN PEMBANGUNAN",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 17,
        "tahun_buku": 2024,
        "id_rpjmd": 29,
        "kode_program": "4.01.03",
        "nama_program": "PROGRAM PEREKONOMIAN DAN PEMBANGUNAN",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 18,
        "tahun_buku": 2022,
        "id_rpjmd": 6,
        "kode_program": "1.03.12",
        "nama_program": "PROGRAM PENYELENGGARAAN PENATAAN RUANG",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 18,
        "tahun_buku": 2023,
        "id_rpjmd": 8,
        "kode_program": "2.08.06",
        "nama_program": "PROGRAM PEMENUHAN HAK ANAK (PHA)",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 18,
        "tahun_buku": 2024,
        "id_rpjmd": 8,
        "kode_program": "2.08.06",
        "nama_program": "PROGRAM PEMENUHAN HAK ANAK (PHA)",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 19,
        "tahun_buku": 2022,
        "id_rpjmd": 7,
        "kode_program": "1.04.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 19,
        "tahun_buku": 2023,
        "id_rpjmd": 21,
        "kode_program": "2.22.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 19,
        "tahun_buku": 2024,
        "id_rpjmd": 21,
        "kode_program": "2.22.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 20,
        "tahun_buku": 2022,
        "id_rpjmd": 7,
        "kode_program": "1.04.02",
        "nama_program": "PROGRAM PENGEMBANGAN PERUMAHAN",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 20,
        "tahun_buku": 2023,
        "id_rpjmd": 22,
        "kode_program": "2.23.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 20,
        "tahun_buku": 2024,
        "id_rpjmd": 22,
        "kode_program": "2.23.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 21,
        "tahun_buku": 2022,
        "id_rpjmd": 7,
        "kode_program": "1.04.03",
        "nama_program": "PROGRAM KAWASAN PERMUKIMAN",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 21,
        "tahun_buku": 2023,
        "id_rpjmd": 23,
        "kode_program": "2.24.02",
        "nama_program": "PROGRAM PENGELOLAAN ARSIP",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 21,
        "tahun_buku": 2024,
        "id_rpjmd": 23,
        "kode_program": "2.24.02",
        "nama_program": "PROGRAM PENGELOLAAN ARSIP",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 22,
        "tahun_buku": 2022,
        "id_rpjmd": 7,
        "kode_program": "1.04.04",
        "nama_program": "PROGRAM PERUMAHAN DAN KAWASAN PERMUKIMAN KUMUH",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 22,
        "tahun_buku": 2023,
        "id_rpjmd": 4,
        "kode_program": "1.04.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 22,
        "tahun_buku": 2024,
        "id_rpjmd": 4,
        "kode_program": "1.04.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 23,
        "tahun_buku": 2022,
        "id_rpjmd": 7,
        "kode_program": "1.04.05",
        "nama_program": "PROGRAM PENINGKATAN PRASARANA, SARANA DAN UTILITAS UMUM (PSU)",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 23,
        "tahun_buku": 2023,
        "id_rpjmd": 13,
        "kode_program": "2.14.04",
        "nama_program": "PROGRAM PEMBERDAYAAN DAN PENINGKATAN KELUARGA SEJAHTERA (KS)",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 23,
        "tahun_buku": 2024,
        "id_rpjmd": 13,
        "kode_program": "2.14.04",
        "nama_program": "PROGRAM PEMBERDAYAAN DAN PENINGKATAN KELUARGA SEJAHTERA (KS)",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 24,
        "tahun_buku": 2022,
        "id_rpjmd": 8,
        "kode_program": "1.05.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 24,
        "tahun_buku": 2023,
        "id_rpjmd": 21,
        "kode_program": "2.22.05",
        "nama_program": "PROGRAM PELESTARIAN DAN PENGELOLAAN CAGAR BUDAYA",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 24,
        "tahun_buku": 2024,
        "id_rpjmd": 21,
        "kode_program": "2.22.05",
        "nama_program": "PROGRAM PELESTARIAN DAN PENGELOLAAN CAGAR BUDAYA",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 25,
        "tahun_buku": 2022,
        "id_rpjmd": 8,
        "kode_program": "1.05.02",
        "nama_program": "PROGRAM PENINGKATAN KETENTERAMAN DAN KETERTIBAN UMUM",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 25,
        "tahun_buku": 2023,
        "id_rpjmd": 28,
        "kode_program": "3.31.04",
        "nama_program": "PROGRAM PENGELOLAAN SISTEM INFORMASI INDUSTRI NASIONAL",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 25,
        "tahun_buku": 2024,
        "id_rpjmd": 28,
        "kode_program": "3.31.04",
        "nama_program": "PROGRAM PENGELOLAAN SISTEM INFORMASI INDUSTRI NASIONAL",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 26,
        "tahun_buku": 2022,
        "id_rpjmd": 8,
        "kode_program": "1.05.03",
        "nama_program": "PROGRAM PENANGGULANGAN BENCANA",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 26,
        "tahun_buku": 2023,
        "id_rpjmd": 27,
        "kode_program": "3.30.03",
        "nama_program": "PROGRAM PENINGKATAN SARANA DISTRIBUSI PERDAGANGAN",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 26,
        "tahun_buku": 2024,
        "id_rpjmd": 27,
        "kode_program": "3.30.03",
        "nama_program": "PROGRAM PENINGKATAN SARANA DISTRIBUSI PERDAGANGAN",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 27,
        "tahun_buku": 2022,
        "id_rpjmd": 8,
        "kode_program": "1.05.04",
        "nama_program": "PROGRAM PENCEGAHAN, PENANGGULANGAN, PENYELAMATAN KEBAKARAN DAN PENYELAMATAN NON KEBAKARAN",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 27,
        "tahun_buku": 2023,
        "id_rpjmd": 14,
        "kode_program": "2.15.03",
        "nama_program": "PROGRAM PENGELOLAAN PELAYARAN",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 27,
        "tahun_buku": 2024,
        "id_rpjmd": 14,
        "kode_program": "2.15.03",
        "nama_program": "PROGRAM PENGELOLAAN PELAYARAN",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 28,
        "tahun_buku": 2022,
        "id_rpjmd": 9,
        "kode_program": "1.06.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 28,
        "tahun_buku": 2023,
        "id_rpjmd": 1,
        "kode_program": "1.01.02",
        "nama_program": "PROGRAM PENGELOLAAN PENDIDIKAN",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 28,
        "tahun_buku": 2024,
        "id_rpjmd": 1,
        "kode_program": "1.01.02",
        "nama_program": "PROGRAM PENGELOLAAN PENDIDIKAN",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 29,
        "tahun_buku": 2022,
        "id_rpjmd": 9,
        "kode_program": "1.06.02",
        "nama_program": "PROGRAM PEMBERDAYAAN SOSIAL",
        "insert_date": "2024-05-30T08:03:54.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 29,
        "tahun_buku": 2023,
        "id_rpjmd": 16,
        "kode_program": "2.17.06",
        "nama_program": "PROGRAM PEMBERDAYAAN DAN PERLINDUNGAN KOPERASI",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 29,
        "tahun_buku": 2024,
        "id_rpjmd": 16,
        "kode_program": "2.17.06",
        "nama_program": "PROGRAM PEMBERDAYAAN DAN PERLINDUNGAN KOPERASI",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 30,
        "tahun_buku": 2022,
        "id_rpjmd": 9,
        "kode_program": "1.06.04",
        "nama_program": "PROGRAM REHABILITASI SOSIAL",
        "insert_date": "2024-05-30T08:03:55.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 30,
        "tahun_buku": 2023,
        "id_rpjmd": 37,
        "kode_program": "7.01.04",
        "nama_program": "PROGRAM KOORDINASI KETENTRAMAN DAN KETERTIBAN UMUM",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 30,
        "tahun_buku": 2024,
        "id_rpjmd": 37,
        "kode_program": "7.01.04",
        "nama_program": "PROGRAM KOORDINASI KETENTRAMAN DAN KETERTIBAN UMUM",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 31,
        "tahun_buku": 2022,
        "id_rpjmd": 9,
        "kode_program": "1.06.05",
        "nama_program": "PROGRAM PERLINDUNGAN DAN JAMINAN SOSIAL",
        "insert_date": "2024-05-30T08:03:55.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 31,
        "tahun_buku": 2023,
        "id_rpjmd": 3,
        "kode_program": "1.03.10",
        "nama_program": "PROGRAM PENYELENGGARAAN JALAN",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 31,
        "tahun_buku": 2024,
        "id_rpjmd": 3,
        "kode_program": "1.03.10",
        "nama_program": "PROGRAM PENYELENGGARAAN JALAN",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 32,
        "tahun_buku": 2022,
        "id_rpjmd": 9,
        "kode_program": "1.06.07",
        "nama_program": "PROGRAM PENGELOLAAN TAMAN MAKAM PAHLAWAN",
        "insert_date": "2024-05-30T08:03:55.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 32,
        "tahun_buku": 2023,
        "id_rpjmd": 8,
        "kode_program": "2.08.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 32,
        "tahun_buku": 2024,
        "id_rpjmd": 8,
        "kode_program": "2.08.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 33,
        "tahun_buku": 2022,
        "id_rpjmd": 10,
        "kode_program": "2.07.01",
        "nama_program": "PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA",
        "insert_date": "2024-05-30T08:03:55.000Z",
        "insert_by": "MASTER_KEY"
    },
    {
        "id_program": 33,
        "tahun_buku": 2023,
        "id_rpjmd": 10,
        "kode_program": "2.10.05",
        "nama_program": "PROGRAM PENYELESAIAN GANTI KERUGIAN DAN SANTUNAN TANAH UNTUK PEMBANGUNAN",
        "insert_date": "2024-04-16T07:44:31.000Z",
        "insert_by": "2024-01-25 22:06:18"
    },
    {
        "id_program": 33,
        "tahun_buku": 2024,
        "id_rpjmd": 10,
        "kode_program": "2.10.05",
        "nama_program": "PROGRAM PENYELESAIAN GANTI KERUGIAN DAN SANTUNAN TANAH UNTUK PEMBANGUNAN",
        "insert_date": "2024-07-30T01:23:43.000Z",
        "insert_by": "2024-04-04 08:59:45"
    },
    {
        "id_program": 34,
        "tahun_buku": 2022,
        "id_rpjmd": 10,
        "kode_program": "2.07.03",
        "nama_program": "PROGRAM PELATIHAN KERJA DAN PRODUKTIVITAS TENAGA KERJA",
        "insert_date": "2024-05-30T08:03:55.000Z",
        "insert_by": "MASTER_KEY"
    }
]);
    }
}

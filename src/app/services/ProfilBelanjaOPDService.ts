import { Paginator } from "@/utils/model/Paginator"
import { BMKegiatan } from "../models/BMKegiatan"
import { MTahapan } from "../models/MTahapan"
import { BMOrg } from "../models/BMOrg"

export class ProfilBelanjaOPDService {

    public async getKegiatans(tahun_buku: number, id_org: number, id_tahapan: number, search: string, page: number, perPage: number) {
        // ambil data
        const listKegiatan = await BMKegiatan
            .where({ tahun_buku, id_org, is_active: 1 })
            .include('subkegiatan', relation => relation.where({ tahun_buku }))
            .thenInclude('komponen', relation => relation.where({ id_tahapan }))
            .thenInclude('komponenRealisasi')
            .whereColumnsLike(['nama_kegiatan', 'kode_kegiatan', 'id_kegiatan'], `%${search || ''}%`)
            .paginate(page, perPage)

        // hitung total anggaran
        const results = listKegiatan.results.map(kegiatan => {
            const totalAnggaran = kegiatan.subkegiatan.reduce((acc, subkegiatan) => {
                const total = subkegiatan.komponen.reduce((acc, komponen) => {
                    return acc + parseInt(komponen.jumlah_total)
                }, 0)
                return acc + total
            }, 0)

            kegiatan.total_anggaran = totalAnggaran

            return kegiatan
        })

        return new Paginator(listKegiatan, results)
    }

    public async getTahapanAndOrg(tahun_buku: number, id_org: number, id_tahapan: number) {
        const tahapan = id_tahapan ? await MTahapan.select('id', 'nama').where({ id: id_tahapan, tahun_buku }).first() : null
        const org = id_org ? await BMOrg.select('id_org', 'nama_org').where({ id_org, tahun_buku }).first() : null

        return { tahapan, org }
    }

}
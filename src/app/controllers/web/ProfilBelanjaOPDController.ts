import { BMKegiatan } from "@/app/models/BMKegiatan";
import { BMOrg } from "@/app/models/BMOrg";
import { BMSubkegiatan } from "@/app/models/BMSubkegiatan";
import { MTahapan } from "@/app/models/MTahapan";
import { createQueryBuilder } from "@/utils/database/DB";
import { Paginator } from "@/utils/model/Paginator";
import { ControllerAction, HttpError } from "@/utils/References";

export class ProfilBelanjaOPDController {
    static index: ControllerAction = async (req, res) => {
        const { tahun_buku } = req.session
        const { search, page, id_org, id_tahapan }: any = req.query

        const tahapan = id_tahapan ? await MTahapan.select('id', 'nama').where({ id: id_tahapan, tahun_buku }).first() : null
        const org = id_org ? await BMOrg.select('id_org', 'nama_org').where({ id_org, tahun_buku }).first() : null

        const perPage = 10
        const query = BMKegiatan.whereColumnsLike(['nama_kegiatan', 'kode_kegiatan', 'id_kegiatan'], `%${search || ''}%`).where({ tahun_buku, id_org, is_active: 1 })
        const pagination = id_org ? await query.paginate(page || 1, perPage) : new Paginator([])

        console.log(createQueryBuilder().table('b_m_kegiatan').where('id', 1).where(qry => { qry.where('tahun_buku', 2022) }).getRaw());


        res.render("profil-belanja-opd/index", { pagination, search, tahun_buku, org, tahapan })
    }

    static subkegiatan: ControllerAction = async (req, res, next) => {
        const { tahun_buku } = req.session
        const { id_kegiatan, id_tahapan, id_org }: any = req.params
        const { search, page }: any = req.query

        const kegiatan = await BMKegiatan.select('id_kegiatan', 'nama_kegiatan').where({ id_kegiatan, tahun_buku }).first()
        const tahapan = await MTahapan.select('id', 'nama').where({ id: id_tahapan, tahun_buku }).first()
        const org = await BMOrg.select('id_org', 'nama_org').where({ id_org, tahun_buku }).first()

        if (!kegiatan || !tahapan || !org) {
            next(new HttpError(404, "Data tidak ditemukan"))
        }

        const query = BMSubkegiatan.where({ tahun_buku, id_kegiatan, is_active: 1 }).whereColumnsLike(['nama_subkegiatan', 'kode_subkegiatan', 'id_subkegiatan'], `%${search || ''}%`)
        const pagination = await query.paginate(page || 1, 10)

        res.render("profil-belanja-opd/subkegiatan", { pagination, search, tahun_buku, kegiatan, tahapan, org })
    }
}
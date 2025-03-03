import { BMKegiatan } from "@/app/models/BMKegiatan";
import { BMOrg } from "@/app/models/BMOrg";
import { BMSubkegiatan } from "@/app/models/BMSubkegiatan";
import { MTahapan } from "@/app/models/MTahapan";
import { ProfilBelanjaOPDService } from "@/app/services/ProfilBelanjaOPDService";
import { ControllerAction, HttpError } from "@/utils/References";

const service = new ProfilBelanjaOPDService()
const perPage = 10

export class ProfilBelanjaOPDController {
    static index: ControllerAction = async (req, res) => {
        const { tahun_buku } = req.session
        const { search, page, id_org, id_tahapan }: any = req.query

        const { org, tahapan } = await service.getTahapanAndOrg(tahun_buku, id_org, id_tahapan)

        const pagination = (await service.getKegiatans(tahun_buku, id_org, id_tahapan, search, page || 1, perPage))

        res.render("profil-belanja-opd/index", { pagination, search, tahun_buku, org, tahapan })
    }

    static subkegiatan: ControllerAction = async (req, res, next) => {
        const { tahun_buku } = req.session
        const { id_kegiatan, id_tahapan, id_org }: any = req.params
        const { search, page }: any = req.query

        const kegiatan = await BMKegiatan.select('id_kegiatan', 'nama_kegiatan').where({ id_kegiatan, tahun_buku }).first()
        const { org, tahapan } = await service.getTahapanAndOrg(tahun_buku, id_org, id_tahapan)

        if (!kegiatan || !tahapan || !org) {
            next(new HttpError(404, "Data tidak ditemukan"))
        }

        const query = BMSubkegiatan.where({ tahun_buku, id_kegiatan, is_active: 1 }).whereColumnsLike(['nama_subkegiatan', 'kode_subkegiatan', 'id_subkegiatan'], `%${search || ''}%`)
        const pagination = await query.paginate(page || 1, 10)

        res.render("profil-belanja-opd/subkegiatan", { pagination, search, tahun_buku, kegiatan, tahapan, org })
    }
}
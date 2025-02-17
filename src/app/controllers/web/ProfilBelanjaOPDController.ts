import { BMOrg } from "@/app/models/BMOrg";
import { ControllerAction } from "@/utils/References";

export class ProfilBelanjaOPDController {
    static index: ControllerAction = async (req, res) => {
        const { tahun_buku } = req.session
        const { search, page } = req.query

        const perPage = 10
        const pagination = await BMOrg.where({ tahun_buku }).whereLike('nama_org', `%${search}%`).paginate(page as unknown as number || 1, perPage)

        res.render("profil-belanja-opd/index", { pagination, search })
    }

    static show: ControllerAction = async (req, res) => {
        // TODO: Implement show logic
    }

    static create: ControllerAction = (req, res) => {
        // TODO: Implement create logic
    }

    static store: ControllerAction = async (req, res) => {
        // TODO: Implement store logic
    }

    static edit: ControllerAction = async (req, res) => {
        // TODO: Implement edit logic
    }

    static update: ControllerAction = async (req, res) => {
        // TODO: Implement update logic
    }

    static delete: ControllerAction = async (req, res) => {
        // TODO: Implement delete logic
    }
}
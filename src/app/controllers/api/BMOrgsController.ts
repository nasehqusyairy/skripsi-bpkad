import { BMOrg } from "@/app/models/BMOrg";
import { Response } from "@/utils/http/Response";
import { ControllerAction } from "@/utils/References";

export class BMOrgsController {
    static index: ControllerAction = async (req, res) => {
        const query = BMOrg.select('nama_org', 'id_org').where({ tahun_buku: req.query.tahun_buku as unknown as number }).whereLike({ nama_org: `%${req.query.nama_org}%` })
        res.json(Response.success("Data OPD ditemukan", await query.get()));
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
import { MTahapan } from "@/app/models/MTahapan";
import { Response } from "@/utils/http/Response";
import { ControllerAction } from "@/utils/References";

export class MTahapanController {
    static index: ControllerAction = async (req, res) => {
        const query = MTahapan.select('nama', 'id').where({ tahun_buku: req.query.tahun_buku as unknown as number }).whereLike({ nama: `%${req.query.nama_tahapan}%` })
        res.json(Response.success("Data Tahapan ditemukan", await query.get()));
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
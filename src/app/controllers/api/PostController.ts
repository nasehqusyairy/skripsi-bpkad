import { Post } from "@/app/models/Post";
import { Response } from "@/utils/http/Response";
import { ControllerAction } from "@/utils/References";

export class PostController {
    static index: ControllerAction = async (req, res) => {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const perPage = 5;

        const pagination = await Post.with("user").where({ user_id: req.userId }).paginate(page, perPage);
        const data = [...pagination.results]

        delete pagination.results;

        res.json(Response.success('Data post berhasil diambil! Berikut adalah daftar postingan yang anda buat.', data, pagination));
    }

    static show: ControllerAction = (req, res) => {
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
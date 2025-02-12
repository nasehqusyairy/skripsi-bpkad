import { Role } from "@/app/models/Role";
import { ControllerAction } from "@/utils/References";

export class RoleController {
    static index: ControllerAction = async (req, res) => {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const perPage = 5;

        const pagination = await Role.whereNot({ id: 1 }).paginate(page, perPage);

        res.render("roles/index", { pagination });
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
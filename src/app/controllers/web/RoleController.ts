import { Role } from "@/app/models/Role";
import { ControllerAction } from "@/utils/References";

export class RoleController {
    static index: ControllerAction = async (req, res) => {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const perPage = 5;

        const pagination = await Role.whereNot({ id: 1 }).paginate(page, perPage);

        res.render("roles/index", { pagination });
    }

    static create: ControllerAction = (req, res) => {
        res.render("roles/create");
    }

    static store: ControllerAction = async (req, res) => {

        await Role.create(req.body);

        res.redirect("/roles");
    }

    static edit: ControllerAction = async (req, res) => {
        res.render("roles/edit", { role: await Role.find(req.params.id) });
    }

    static update: ControllerAction = async (req, res) => {
        await Role.where({ id: parseInt(req.params.id) }).update({ name: req.body.name });
        res.redirect("/roles");
    }

    static delete: ControllerAction = async (req, res) => {
        await Role.where({ id: parseInt(req.params.id) }).delete();
        res.redirect("/roles");
    }
}
import { Role } from "@/app/models/Role";
import { User } from "@/app/models/User";
import { ControllerAction } from "@/utils/References";

export class UserController {
    static index: ControllerAction = async (req, res) => {

        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const perPage = 5;

        const userId = parseInt(req.session.userId.toString());
        const pagination = await User.with("roles").whereNot({ id: userId }).paginate(page, perPage);

        res.render("users/index", { pagination })
    }

    static roles: ControllerAction = async (req, res) => {

        const u = await User.find(req.params.id);
        await u.load('roles');

        const userRoles = u.roles as unknown as Role[];
        const userRoleIds = userRoles.map(role => role.id);
        const query = Role.whereNot({ id: 1 });

        const unassignedRoles = userRoles.length ?
            await query.whereNotIn({ id: userRoleIds }).get() :
            await query.get();

        res.render("users/roles", { u, unassignedRoles, userRoles });
    }

    static assignRole: ControllerAction = async (req, res) => {

        const u = new User({ id: parseInt(req.params.id) });
        await u.roles().attach(req.body.role_id);

        res.redirect(`/users/roles/${u.id}`);
    }

    static removeRole: ControllerAction = async (req, res) => {
        const u = new User({ id: parseInt(req.params.id) });
        await u.roles().detach(req.query.role_id);

        res.redirect(`/users/roles/${u.id}`);
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
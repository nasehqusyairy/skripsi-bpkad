import { Role } from '@/app/models/Role';
import { User } from '@/app/models/User';
import { ControllerAction } from '@/utils/References';
import bcrypt from 'bcryptjs';

export class AuthController {
    // Menampilkan halaman login
    static index: ControllerAction = async (req, res) => {
        res.render("auth/index");
    }

    static login: ControllerAction = async (req, res) => {
        const { email, password } = req.body;
        const user = await User.where({ email }).with('roles').first();

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.userId = user.id;
            req.session.roles = (user.roles as unknown as Role[]).map(role => role.name);
            return res.redirect("/dashboard");
        }

        req.flash("error", "Wrong email or password!");
        req.flash("old", { email });
        res.redirect("/auth");
    }

    // Logout user
    static logout: ControllerAction = (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
            }
            res.redirect("/auth");
        });
    }


    static register: ControllerAction = async (req, res) => {
        const { email, password } = req.body;
        const user = await User.create({
            email,
            password: bcrypt.hashSync(password)
        })

        await user.load('roles')

        req.session.userId = user.id;
        req.session.roles = (user.roles as unknown as Role[]).map(role => role.name);

        return res.redirect("/dashboard");
    }

    static registerView: ControllerAction = (req, res) => {
        res.render("auth/register");
    }

}
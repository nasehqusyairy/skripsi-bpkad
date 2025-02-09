import { ControllerAction } from "@/utils/References.js";
import { IUser, User } from "../../models/User.js";
import bcrypt from 'bcryptjs';

export class AuthController {
    // Menampilkan halaman login
    static index: ControllerAction = async (req, res) => {
        res.render("auth/index");
    }

    static login: ControllerAction = async (req, res) => {
        const { email, password } = req.body;
        const user = (await User.where({ email }).first()) as User & IUser;

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.userId = user.id;
            return res.redirect("/dashboard");
        }

        req.flash("error", "Username atau Password salah!");
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
        const user = (await User.create({
            email,
            password: bcrypt.hashSync(password, 10)
        })) as User & IUser;

        req.session.userId = user.id;
        // console.log('register', { userId: req.session.userId });

        return res.redirect("/dashboard");
    }

    static registerView: ControllerAction = (req, res) => {
        res.render("auth/register");
    }

}
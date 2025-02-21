import { Role } from '@/app/models/Role';
import { User } from '@/app/models/User';
import { addToBlacklist } from '@/utils/Blacklist';
import { ControllerAction } from '@/utils/References';
import bcrypt from 'bcryptjs';
import { decodeJwt, SignJWT } from 'jose';

export class AuthController {
    // Menampilkan halaman login
    static index: ControllerAction = async (req, res) => {
        res.render("auth/index");
    }

    static login: ControllerAction = async (req, res) => {
        const { email, password } = req.body;
        const user = await User.with('roles').where({ email }).first();

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.userId = user.id;
            req.session.roles = (user.roles as unknown as Role[]).map(role => role.name);

            // Buat token JWT
            const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
            const token = await new SignJWT({ userId: user.id })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime(process.env.SESSION_TIMEOUT)
                .sign(secret);

            const decoded = decodeJwt(token);

            // Set cookie
            res.cookie(process.env.SESSION_COOKIE_NAME, token, {
                httpOnly: true,
                secure: process.env.APP_DEBUG === "false",
                sameSite: "strict",
                expires: new Date(decoded.exp * 1000)
            });

            return res.redirect(req.query.next ? req.query.next as string : "/dashboard");
        }

        req.flash("error", "Wrong email or password!");
        req.flash("old", { email });
        res.redirect("/auth");
    }

    // Logout user
    static logout: ControllerAction = (req, res) => {
        // remove cookie and blacklist token
        res.clearCookie(process.env.SESSION_COOKIE_NAME);
        addToBlacklist(req.cookies[process.env.SESSION_COOKIE_NAME]);
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
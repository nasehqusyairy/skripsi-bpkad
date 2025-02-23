import { isBlacklisted } from "@/utils/Blacklist";
import { Response } from "@/utils/http/Response";
import { Middleware } from "@/utils/References";
import { jwtVerify } from "jose";
import { User } from "../models/User";
import { Role } from "../models/Role";

/**
 * Utilitas untuk mendapatkan user dari token JWT.
 */
const getUserFromToken = async (token: string) => {
    if (!token) {
        throw new Error('You are not authenticated');
    }

    if (isBlacklisted(token)) {
        throw new Error('Session has been invalidated');
    }

    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(token, secret) as { payload: { userId: string, tahun_buku: number } };

    const user = await User.with('roles').where({ id: parseInt(payload.userId) }).first();

    return {
        userId: payload.userId,
        roles: user.attributes.roles.map(role => role.name),
        tahun_buku: payload.tahun_buku
    };
};

/**
 * Middleware autentikasi untuk API.
 */
export const apiAuth: Middleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new Error('Token tidak ditemukan');

        const { userId } = await getUserFromToken(token);
        req.userId = userId;
        next();
    } catch (error) {
        res.status(401).json(Response.error(error.message));
    }
};

/**
 * Middleware autentikasi untuk aplikasi web.
 */
export const webAuth: Middleware = async (req, res, next) => {
    if (req.session.userId) {
        const { userId, roles, tahun_buku } = req.session;
        res.locals.user = { userId, roles, tahun_buku };
        return next();
    }

    try {
        const token = req.cookies[process.env.SESSION_COOKIE_NAME];
        const { userId, roles, tahun_buku } = await getUserFromToken(token);

        req.session.userId = userId;
        req.session.roles = roles;
        req.session.tahun_buku = tahun_buku;

        res.locals.user = { id: userId, roles, tahun_buku };

        next();
    } catch (error) {
        req.flash('error', error.message);
        // Redirect ke halaman login sekaligus membawa query string next
        res.redirect(`/auth?next=${req.originalUrl}`);
    }
};

/**
 * Middleware untuk user guest.
 */
export const guest: Middleware = async (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/dashboard');
    }

    try {
        const token = req.cookies[process.env.SESSION_COOKIE_NAME];
        const { userId, roles } = await getUserFromToken(token);

        req.session.userId = userId;
        req.session.roles = roles;
        res.locals.user = { id: userId, roles };

        return res.redirect('/dashboard');
    } catch {
        next();
    }
};

/**
 * Middleware khusus admin.
 */
export const adminOnly: Middleware = (req, res, next) => {
    if (req.session.roles?.includes('admin')) {
        return next();
    }
    res.redirect('/dashboard');
};

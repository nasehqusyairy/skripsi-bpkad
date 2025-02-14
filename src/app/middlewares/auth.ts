import { isBlacklisted } from "@/utils/Blacklist";
import { Response } from "@/utils/http/Response";
import { Middleware } from "@/utils/References";
import { jwtVerify } from "jose";

export const apiAuth: Middleware = async (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json(Response.error('Token tidak ditemukan'));
    }

    try {
        const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
        const { payload } = await jwtVerify(token, secret) as { payload: { userId: string } };

        if (isBlacklisted(token)) {
            return res.status(401).json(Response.error('Token sudah tidak valid'));
        }

        req.userId = payload.userId;
        next();
    } catch (error) {
        res.status(401).json(Response.error('Token tidak valid'));
    }
};

export const webAuth: Middleware = (req, res, next) => {

    if (req.session.userId) {
        res.locals.user = {
            id: req.session.userId,
            roles: req.session.roles
        }
        next();
    } else {
        res.redirect('/auth');
    }
}

export const guest: Middleware = (req, res, next) => {
    if (!req.session.userId) {
        next();
    } else {
        res.redirect('/dashboard');
    }
}

export const adminOnly: Middleware = (req, res, next) => {
    if (req.session.roles.includes('admin')) {
        next();
    } else {
        res.redirect('/dashboard');
    }
}

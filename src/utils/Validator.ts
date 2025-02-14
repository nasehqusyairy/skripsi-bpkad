import { ZodError } from "zod";
import { Response as ExpressResponse, Request as ExpressRequest, NextFunction } from 'express';
import { Response } from "@/utils/http/Response";
import { Middleware } from "./References";

export abstract class Validator {

    protected redirectUrl: string;

    abstract rules(): any;

    public validate: Middleware = async (req, res, next) => {
        try {
            const schema = this.rules();
            const validatedData = await schema.parseAsync(req.body); // Validasi data
            req.body = { ...req.body, ...validatedData }; // Gabungkan data validasi dengan req.body
            next();
        } catch (err) {
            // Tangani error validasi
            handleValidationError(err, req, res, { redirectUrl: this.redirectUrl });
        }
    }
}

export function getValidationErrors(err: ZodError) {

    return err.errors.reduce((acc, error) => {
        const path = error.path.join("."); // Gabungkan path menjadi string
        if (!acc[path]) {
            acc[path] = [];
        }
        acc[path].push(error.message);
        return acc;
    }, {});
}

export type ValidationErrorOptions = {
    redirectUrl?: string;
    jsonResponse?: boolean;
};

export function handleValidationError(err: Error | ZodError, req: ExpressRequest, res: ExpressResponse, options: ValidationErrorOptions = {}) {
    const { redirectUrl = req.get("Referrer") || "/", jsonResponse = false } = options;

    if (err instanceof ZodError) {
        const formattedErrors = getValidationErrors(err);

        if (jsonResponse) {
            return res.status(422).json(Response.error("Invalid data", formattedErrors));
        } else {
            req.flash("errors", formattedErrors);
        }
    } else {
        if (jsonResponse) {
            return res.status(500).json(Response.error("Terjadi kesalahan saat memproses permintaan."));
        } else {
            req.flash("error", "Terjadi kesalahan saat memproses permintaan.");
        }
        console.error("Unexpected Error:", err);
    }

    req.flash("old", req.body);
    res.redirect(redirectUrl);
}


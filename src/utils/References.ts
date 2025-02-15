import { Request, Response, NextFunction } from "express";

export type ControllerAction = (req: Request, res: Response) => void;

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export class HttpError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export type ErrorRequestHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => void;

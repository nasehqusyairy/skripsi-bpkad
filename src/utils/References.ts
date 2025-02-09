import { Request, Response, NextFunction } from "express";

export type ControllerAction = (req: Request, res: Response) => void;

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;
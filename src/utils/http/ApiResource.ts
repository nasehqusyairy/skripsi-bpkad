import express from 'express';
import { Middleware } from "../References";
import { ResourceRoute } from "./ResourceRoute";

export class ApiResource extends ResourceRoute {

    constructor(router: express.Router, prefix: string, controller: any, middlewares: Middleware[] = []) {
        super(router, controller);
        this.routes = {
            index: { middlewares, method: "get", path: `/${prefix}`, action: "index" },
            store: { middlewares, method: "post", path: `/${prefix}`, action: "store" },
            update: { middlewares, method: "put", path: `/${prefix}/:id`, action: "update" },
            patch: { middlewares, method: "patch", path: `/${prefix}/:id`, action: "update" },
            delete: { middlewares, method: "delete", path: `/${prefix}/:id`, action: "delete" },
        };
    }
}
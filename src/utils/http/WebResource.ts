import express from 'express';
import { Middleware } from "../References";
import { ResourceRoute } from "./ResourceRoute";

export class WebResource extends ResourceRoute {

    constructor(router: express.Router, prefix: string, controller: any, middlewares: Middleware[] = []) {
        super(router, controller);
        this.routes = {
            index: { middlewares, method: "get", path: `/${prefix}`, action: "index" },
            show: { middlewares, method: "get", path: `/${prefix}/show/:id`, action: "show" },
            create: { middlewares, method: "get", path: `/${prefix}/create`, action: "create" },
            store: { middlewares, method: "post", path: `/${prefix}/store`, action: "store" },
            edit: { middlewares, method: "get", path: `/${prefix}/edit/:id/`, action: "edit" },
            update: { middlewares, method: "post", path: `/${prefix}/update/:id`, action: "update" },
            delete: { middlewares, method: "get", path: `/${prefix}/delete/:id`, action: "delete" },
        };
    }
}
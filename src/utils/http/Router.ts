import { webAuth } from '@/app/middlewares/auth';
import express from 'express';
import { Middleware } from '../References';

export type RouterGroupCallback = (router: Router) => void;

export class Router {

    router: express.Router;

    constructor() {
        this.router = express.Router();

        // Gunakan Proxy untuk meneruskan semua metode secara otomatis
        return new Proxy(this, {
            get(target, prop) {
                if (prop in target) return target[prop]; // Jika metode ada di CustomRouter, gunakan itu
                if (prop in target.router) return target.router[prop].bind(target.router); // Jika tidak, ambil dari express.Router
                return undefined;
            }
        });
    }

    group(prefix: string, callback: RouterGroupCallback) {
        const subRouter = new Router();
        callback(subRouter);
        this.router.use(prefix, subRouter.router);
        return this;
    }

    resource(prefix: string, controller: any, middlewares: Middleware[] = []) {
        const routes = [
            { method: "get", path: `/${prefix}`, action: "index" },
            { method: "get", path: `/${prefix}/show/:id`, action: "show" },
            { method: "get", path: `/${prefix}/create`, action: "create" },
            { method: "post", path: `/${prefix}/store`, action: "store" },
            { method: "get", path: `/${prefix}/edit/:id`, action: "edit" },
            { method: "post", path: `/${prefix}/update/:id`, action: "update" },
            { method: "get", path: `/${prefix}/delete/:id`, action: "delete" },
        ];

        for (const route of routes) {
            if (typeof controller[route.action] === "function") {
                this.router[route.method](route.path, ...middlewares, controller[route.action]);
            }
        }

        return this;
    }

    apiResource(prefix: string, controller: any, middlewares: Middleware[] = []) {
        const routes = [
            { method: "get", path: `/${prefix}`, action: "index" },
            { method: "post", path: `/${prefix}`, action: "store" },
            { method: "get", path: `/${prefix}/:id`, action: "show" },
            { method: "put", path: `/${prefix}/:id`, action: "update" },
            { method: "delete", path: `/${prefix}/:id`, action: "delete" },
        ];

        for (const route of routes) {
            if (typeof controller[route.action] === "function") {
                this.router[route.method](route.path, ...middlewares, controller[route.action]);
            }
        }

        return this;
    }

}

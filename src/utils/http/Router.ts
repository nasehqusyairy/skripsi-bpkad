import express from 'express';
import { ControllerAction, Middleware } from '../References';
import { WebResource } from './WebResource';
import { ApiResource } from './ApiResource';

export type RouterGroupCallback = (router: Router) => void;

export type ResourceController = {
    index: ControllerAction;
    show: ControllerAction;
    create: ControllerAction;
    store: ControllerAction;
    edit: ControllerAction;
    update: ControllerAction;
    delete: ControllerAction;
}

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

    resource(prefix: string, controller: Partial<ResourceController>, middlewares: Middleware[] = []) {
        const resource = new WebResource(this.router, prefix, controller, middlewares);
        const routes = resource.getRoutes();

        for (const route of routes) {
            if (typeof controller[route.action] === "function") {
                this.router[route.method](route.path, ...route.middlewares, controller[route.action]);
            }
        }

        return resource;
    }

    apiResource(prefix: string, controller: Partial<ResourceController>, middlewares: Middleware[] = []) {
        const resource = new ApiResource(this.router, prefix, controller, middlewares);
        const routes = resource.getRoutes();

        for (const route of routes) {
            if (typeof controller[route.action] === "function") {
                this.router[route.method](route.path, ...route.middlewares, controller[route.action]);
            }
        }

        return resource;
    }

}

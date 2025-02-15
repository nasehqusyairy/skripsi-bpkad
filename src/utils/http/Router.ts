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
    middlewares: Middleware[] = [];

    constructor(middlewares: Middleware[] = []) {
        this.router = express.Router();
        this.middlewares = middlewares;

        // Gunakan Proxy untuk meneruskan semua metode secara otomatis
        return new Proxy(this, {
            get(target, prop) {
                if (prop in target) return target[prop]; // Jika metode ada di CustomRouter, gunakan itu
                if (prop in target.router) return target.router[prop].bind(target.router); // Jika tidak, ambil dari express.Router
                return undefined;
            }
        });
    }

    get(path: string, ...handlers: Middleware[]) {
        this.router.get(path, ...this.middlewares, ...handlers);
        return this;
    }

    post(path: string, ...handlers: Middleware[]) {
        this.router.post(path, ...this.middlewares, ...handlers);
        return this;
    }

    put(path: string, ...handlers: Middleware[]) {
        this.router.put(path, ...this.middlewares, ...handlers);
        return this;
    }

    patch(path: string, ...handlers: Middleware[]) {
        this.router.patch(path, ...this.middlewares, ...handlers);
        return this;
    }

    delete(path: string, ...handlers: Middleware[]) {
        this.router.delete(path, ...this.middlewares, ...handlers);
        return this;
    }

    options(path: string, ...handlers: Middleware[]) {
        this.router.options(path, ...this.middlewares, ...handlers);
        return this;
    }

    group(prefix: string, callback: RouterGroupCallback, middlewares: Middleware[] = []) {
        this.middlewares.push(...middlewares)

        const subRouter = new Router(this.middlewares);
        callback(subRouter);

        this.router.use(prefix, subRouter.router);
        return this;
    }

    resource(prefix: string, controller: Partial<ResourceController>, middlewares: Middleware[] = []) {

        middlewares = [...this.middlewares, ...middlewares];

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

        middlewares = [...this.middlewares, ...middlewares];

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

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

        this.router.get(`/${prefix}`, ...middlewares, controller.index);
        this.router.get(`/${prefix}/create`, ...middlewares, controller.create);
        this.router.post(`/${prefix}/store`, ...middlewares, controller.store);
        this.router.get(`/${prefix}/edit/:id`, ...middlewares, controller.edit);
        this.router.post(`/${prefix}/update/:id`, ...middlewares, controller.update);
        this.router.get(`/${prefix}/delete/:id`, ...middlewares, controller.delete);
        return this;
    }

    apiResource(prefix: string, controller: any, middlewares: Middleware[] = []) {

        this.router.get(`/${prefix}`, ...middlewares, controller.index);
        this.router.post(`/${prefix}`, ...middlewares, controller.store);
        this.router.get(`/${prefix}/:id`, ...middlewares, controller.show);
        this.router.put(`/${prefix}/:id`, ...middlewares, controller.update);
        this.router.delete(`/${prefix}/:id`, ...middlewares, controller.delete);
        return this;
    }
}

import express from 'express';

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
    }
}

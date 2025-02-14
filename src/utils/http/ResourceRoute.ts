import express from 'express';
import { Middleware } from "../References";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export type RouteConfig = {
    method: HttpMethod;
    path: string;
    middlewares?: Middleware[];
    action: string;
}

export type ResourceRouteCollection = {
    index: RouteConfig;
    show?: RouteConfig;
    create?: RouteConfig;
    store: RouteConfig;
    edit?: RouteConfig;
    update: RouteConfig;
    patch?: RouteConfig;
    delete: RouteConfig;
}

export class ResourceRoute {
    private controller: any;
    protected routes: ResourceRouteCollection;
    protected router: express.Router;

    public getRoutes(): RouteConfig[] {
        return Object.values(this.routes);
    }

    constructor(router: express.Router, controller: any) {
        this.router = router;
        this.controller = controller;
    }

    public changeConfig(name: keyof ResourceRouteCollection, callback: (config: RouteConfig) => Partial<RouteConfig>): this {

        let config: RouteConfig = this.routes[name];

        // Hapus route lama berdasarkan method dan path
        this.removeRoute(config);

        config = {
            ...config,
            ...callback(config)
        }

        this.routes[name] = config;

        this.router[config.method](config.path, ...config.middlewares, this.controller[config.action]);

        return this;
    }

    private removeRoute(config: RouteConfig) {
        this.router.stack = this.router.stack.filter(layer => {
            const route = layer.route;
            if (!route) return true; // Jika bukan route (middleware dsb.), biarkan tetap ada

            const methods = route.stack.map((layer: any) => layer.method.toUpperCase()); // Metode yang terdaftar
            return !(route.path === config.path && methods.includes(config.method.toUpperCase()));
        });
    }

    public changeConfigs(name: (keyof ResourceRouteCollection)[], callback: (config: RouteConfig) => Partial<RouteConfig>): this {
        name.forEach((n) => {
            this.changeConfig(n, callback);
        });
        return this;
    }

    public addRequest(name: keyof ResourceRouteCollection | (keyof ResourceRouteCollection)[], validator: Middleware): this {
        if (Array.isArray(name)) {
            name.forEach((n) => this.addRequest(n, validator));
            return this;
        }
        return this.changeConfig(name, ({ middlewares }) => ({ middlewares: [...middlewares, validator] }));
    }

    public except(...names: (keyof ResourceRouteCollection)[]): this {
        names.forEach((name) => {
            this.removeRoute(this.routes[name]);
            this.routes[name] = undefined;
        });

        return this;
    }
}
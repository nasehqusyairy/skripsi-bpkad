import { AuthController } from "@/app/controllers/web/AuthController";
import { DashboardController } from "@/app/controllers/web/DashboardController";
import { HomeController } from "@/app/controllers/web/HomeController";
import { guest, webAuth } from "@/app/middlewares/auth";
import { RegisterRequest } from "@/app/requests/web/auth/RegisterRequest";
import { Router } from "@/utils/http/Router";
import express from "express";


const router = new Router() as Router & express.Router;

router.get('/', HomeController.index);

router.group('/auth', (authRouter: Router & express.Router) => {

    authRouter.get('/', guest, AuthController.index);
    authRouter.post('/login', AuthController.login);

    authRouter.get('/logout', AuthController.logout);

    authRouter.get('/register', guest, AuthController.registerView);
    authRouter.post('/register', RegisterRequest.validate, AuthController.register);
});

router.get('/dashboard', webAuth, DashboardController.index);

export const webRoutes = router.router;
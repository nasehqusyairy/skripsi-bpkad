import { AuthController } from "@/app/controllers/web/AuthController";
import { DashboardController } from "@/app/controllers/web/DashboardController";
import { HomeController } from "@/app/controllers/web/HomeController";
import { PostController } from "@/app/controllers/web/PostController";
import { RoleController } from "@/app/controllers/web/RoleController";
import { UserController } from "@/app/controllers/web/UserController";
import { adminOnly, guest, webAuth } from "@/app/middlewares/auth";
import { RegisterRequest } from "@/app/requests/web/auth/RegisterRequest";
import { RoleRequest } from "@/app/requests/web/roles/RoleRequest";
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

router.resource('posts', PostController, [webAuth]);


router.group('/users', (userRouter: Router & express.Router) => {
    userRouter.get('/', webAuth, adminOnly, UserController.index);
    userRouter.group('/roles', (roleRouter: Router & express.Router) => {
        roleRouter.get('/:id', webAuth, adminOnly, UserController.roles);
        roleRouter.post('/assign/:id', webAuth, adminOnly, UserController.assignRole);
        roleRouter.get('/remove/:id', webAuth, adminOnly, UserController.removeRole);
    });
});

router.group('/roles', (roleRouter: Router & express.Router) => {
    roleRouter.get('/', webAuth, adminOnly, RoleController.index);
    roleRouter.get('/create', webAuth, adminOnly, RoleController.create);
    roleRouter.post('/store', webAuth, adminOnly, RoleRequest.validate, RoleController.store);
    roleRouter.get('/edit/:id', webAuth, adminOnly, RoleController.edit);
    roleRouter.post('/update/:id', webAuth, adminOnly, RoleRequest.validate, RoleController.update);
    roleRouter.get('/delete/:id', webAuth, adminOnly, RoleController.delete);
});

export const webRoutes = router.router;
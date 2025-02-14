import { AuthController } from "@/app/controllers/web/AuthController";
import { DashboardController } from "@/app/controllers/web/DashboardController";
import { HomeController } from "@/app/controllers/web/HomeController";
import { PostController } from "@/app/controllers/web/PostController";
import { RoleController } from "@/app/controllers/web/RoleController";
import { UserController } from "@/app/controllers/web/UserController";
import { adminOnly, guest, webAuth } from "@/app/middlewares/auth";
import { RegisterRequest } from "@/app/requests/web/auth/RegisterRequest";
import { AssignRoleRequest } from "@/app/requests/web/users/AssignRoleRequest";
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
    authRouter.post('/register', RegisterRequest, AuthController.register);
});

// Authenticated User Only
router.use(webAuth);

router.get('/dashboard', DashboardController.index);

router.resource('posts', PostController);

// Admin Only
router.use(adminOnly);

router.group('/users', (userRouter: Router & express.Router) => {
    userRouter.get('/', UserController.index);
    userRouter.group('/roles', (roleRouter: Router & express.Router) => {
        roleRouter.get('/:id', UserController.roles);
        roleRouter.post('/assign/:id', AssignRoleRequest, UserController.assignRole);
        roleRouter.get('/remove/:id', UserController.removeRole);
    });
});

router.resource('roles', RoleController)
    .except('show')
    .addRequest(['store', 'update'], RoleRequest)

export const webRoutes = router.router;
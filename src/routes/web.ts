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

const router = new Router();

router.get('/', HomeController.index);

router.group('/auth', router => {

    router.get('/', guest, AuthController.index);
    router.post('/login', AuthController.login);

    router.get('/logout', AuthController.logout);

    router.get('/register', guest, AuthController.registerView);
    router.post('/register', RegisterRequest, AuthController.register);
});

// Authenticated User Only
router.group('/', router => {

    router.get('/dashboard', DashboardController.index);

    router.resource('posts', PostController);

    // Admin Only
    router.group('/', (router) => {

        router.group('/users', router => {
            router.get('/', UserController.index);
            router.group('/roles', router => {
                router.get('/:id', UserController.roles);
                router.post('/assign/:id', AssignRoleRequest, UserController.assignRole);
                router.get('/remove/:id', UserController.removeRole);
            });
        });

        router.resource('roles', RoleController)
            .except('show')
            .addRequest(['store', 'update'], RoleRequest)

    }, [adminOnly]);
}, [webAuth]);

export const webRoutes = router.router;
import { ProfileController } from "@/app/controllers/api/ProfileController";
import { AuthController } from "@/app/controllers/api/AuthController";
import { apiAuth } from "@/app/middlewares/auth";
import { Router } from "@/utils/http/Router";
import { Response } from "@/utils/http/Response";
import express, { Response as ExpressResponse, Request as ExpressRequest } from 'express';
import { PostController } from "@/app/controllers/api/PostController";


const router = new Router();

router.get('/', (req: ExpressRequest, res: ExpressResponse) => {
    res.json(Response.success('Welcome to My App API'));
});

// Contoh endpoint yang memerlukan autentikasi
router.get('/profile', apiAuth, ProfileController.index);

// // Grouping rute auth
router.group('/auth', router => {
    // Endpoint untuk login
    router.post('/', AuthController.login);
    router.get('/logout', apiAuth, AuthController.logout);
});

router.apiResource('posts', PostController, [apiAuth]);

export const apiRoutes = router.router;

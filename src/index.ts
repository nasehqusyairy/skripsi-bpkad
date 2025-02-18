import 'module-alias/register';
import express, { Request } from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import engine from 'ejs-mate';
import flash from 'express-flash';
import cookieParser from 'cookie-parser';
import { webRoutes } from '@/routes/web';
import { apiRoutes } from '@/routes/api';
import { doubleCsrf } from 'csrf-csrf';
import { ErrorRequestHandler, HttpError, Middleware } from './utils/References';
import expressListEndpoints from 'express-list-endpoints';

export const app = express();

// Middleware untuk mengakses folder public
app.use(express.static(path.join(__dirname, "../public")));

// Middleware
app.use(cors());
app.use(express.json());

app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

//#region CSRF Protection
// Konfigurasi CSRF Protection
const { generateToken, doubleCsrfProtection, invalidCsrfTokenError } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    getTokenFromRequest: (req) => req.body._csrf || req.headers["x-csrf-token"],
    cookieName: "csrftoken",
    cookieOptions: { httpOnly: true, secure: process.env.APP_DEBUG !== "true" },
});
//#endregion

//#region Session
app.use(
    session({
        secret: process.env.SESSION_SECRET || "secretkey",
        resave: false,
        saveUninitialized: true
    })
);
app.use(flash());
//#endregion

//#region Utils
app.locals.title = "My App";

// Middleware untuk menambahkan fungsi old() ke res.locals
app.use((req, res, next) => {

    const old = req.flash("old")[0] || {};

    res.locals.old = (key: string, defaultValue: string = '') => {
        return old[key] || defaultValue;
    };
    next();
});

// Middleware untuk menambahkan fungsi errors() ke res.locals
app.use((req, res, next) => {

    const errors = req.flash("errors")[0] || {};

    res.locals.errors = (key: string) => {
        return errors[key] || [];
    };
    next();
});
//#endregion

// Middleware untuk menambahkan fungsi csrfToken() ke res.locals
app.use((req, res, next) => {
    const token = generateToken(req, res);
    res.cookie('XSRF-TOKEN', token);
    res.locals.csrfToken = () => token;
    res.locals.csrfField = () => `<input type="hidden" name="_csrf" value="${token}"/>`;
    next();
});

// Middleware untuk menambahkan fungsi url() ke res.locals
app.use((req, res, next) => {
    res.locals.url = () => new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    next();
});

const csrfErrorHandler: ErrorRequestHandler = (err: HttpError, req, res, next) => {
    if (err == invalidCsrfTokenError) {
        return res.status(403).render('403');
    }
    next();
}

const removeCsrfField: Middleware = (req, res, next) => {
    delete req.body._csrf;
    next();
}

//#region Routes
app.use('/api', apiRoutes);
app.use("/", doubleCsrfProtection, removeCsrfField, csrfErrorHandler, webRoutes);
//#endregion

export const endpoints = expressListEndpoints(app);

//#region Error Handlers
// 405
app.use((req, res, next) => {

    endpoints.forEach(route => {
        if (route.path === req.path && !route.methods.includes(req.method)) {
            return res.status(405).render('405');
        }
    });

    next();
});

// 404
app.use((req, res) => {
    res.status(404).render('404');
})

// 500
app.use((err: HttpError, req: Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.message);
    if (err.statusCode === 404) {
        return res.status(404).render('404');
    }
    res.status(500).render('500');
});
//#endregion

// Jalankan server
const port = process.env.APP_PORT || 5000;
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
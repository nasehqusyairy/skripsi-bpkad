import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import engine from 'ejs-mate';
import flash from 'express-flash';
import { webRoutes } from '@/routes/web';
import { apiRoutes } from '@/routes/api';

export const app = express();

// Middleware untuk mengakses folder public
app.use(express.static(path.join(__dirname, "../public")));

// Middleware
app.use(cors());
app.use(express.json());

app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "secretkey",
        resave: false,
        saveUninitialized: true
    })
);
app.use(flash());

// Middleware untuk menambahkan fungsi old() ke res.locals
app.use((req, res, next) => {

    const old = req.flash("old")[0] || {};

    res.locals.old = (key: string) => {
        return old[key] || '';
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

app.locals.title = "Server Mitra";

// Gunakan routes
app.use('/', webRoutes);
app.use('/api', apiRoutes);


// Jalankan server
const port = process.env.APP_PORT || 5000;
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
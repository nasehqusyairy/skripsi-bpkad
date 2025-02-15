# EloTS - Dokumentasi Framework

## Pendahuluan

EloTS adalah framework berbasis **[Express](https://expressjs.com/), [EJS](https://ejs.co/), dan [TypeScript](https://www.typescriptlang.org)** yang terinspirasi dari [Laravel](https://laravel.com) dan [ASP.NET](https://dotnet.microsoft.com/apps/aspnet). Framework ini memiliki fitur **query builder mirip Eloquent** dengan dukungan **MariaDB**. Struktur proyeknya mengikuti pola **MVC** dan memiliki fitur tambahan seperti middleware, request validation, migration, seeder, dan scaffolding. Selain itu, framework ini juga memanfaatkan tipe data statis dan OOP pada [TypeScript](https://www.typescriptlang.org) untuk membuat kode terjaga dari kesalahan

## Fitur Utama

- **Arsitektur MVC** (Model, View, Controller)
- **Routing terpisah** untuk API dan web
- **Middleware untuk proteksi request**
- **Query Builder mirip Eloquent** (hanya mendukung MariaDB untuk saat ini)
- **Migration & Seeder** untuk pengelolaan database
- **Relasi Database** seperti `HasOne`, `HasMany`, `BelongsTo`, dan `BelongsToMany`
- **CLI Tools** untuk scaffolding, migration, dan seeding
- **Template Engine EJS** untuk rendering halaman web
- **Dukungan Validasi Request** seperti [Laravel](https://laravel.com)

## Instalasi

### Persyaratan Sistem

Sebelum menggunakan EloTS, pastikan Anda memiliki:

- **[Node.js](https://nodejs.org)** (versi terbaru disarankan)
- **MariaDB**
- **[TypeScript](https://www.typescriptlang.org)**

### Langkah Instalasi

1. Clone repository EloTS:
   ```sh
   git clone https://github.com/nasehqusyairy/elo-ts.git myapp
   cd myapp
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Buat file konfigurasi `.env` berdasarkan `env.example`:
   ```sh
   copy env.example .env
   npm run key:generate
   ```
4. Jalankan migration database:
   ```sh
   npm run migrate
   ```
5. Jalankan seeder untuk memasukkan data awal:
   ```sh
   npm run seed
   ```
6. Build dan jalankan server:
   ```sh
   npm run build
   npm start
   ```
   atau kamu bisa menjalankan perintah `watch` untuk memudahkan development
    ```sh
   npm run watch
   ```

## Struktur Folder

```
elo-ts
├─ commands/            # CLI Commands untuk scaffolding & migration
├─ public/              # Static assets seperti CSS dan JS
├─ src/
│  ├─ app/
│  │  ├─ controllers/   # Folder untuk Controller
│  │  ├─ middlewares/   # Folder untuk Middleware
│  │  ├─ models/        # Folder untuk Model
│  │  ├─ requests/      # Folder untuk validasi Request
│  ├─ database/         # Folder untuk migration dan seeder
│  ├─ routes/           # Routing API & Web
│  ├─ utils/            # Utility functions, Query Builder, dsb.
├─ views/               # Template EJS
└─ tsconfig.json        # Konfigurasi TypeScript
```


## Model & Query Builder

EloTS memiliki query builder seperti Eloquent, tetapi untuk saat ini hanya mendukung MariaDB.

### Membuat Model

Untuk membuat model baru, gunakan perintah berikut:

```sh
npm run make:model NamaClass
```

Perintah ini akan menghasilkan file model di dalam folder `src/app/models` dengan template sebagai berikut:

```ts
import { Model } from "@/utils/model/Model";

export interface I{{className}} {}

export class {{className}} extends Model<I{{className}}> implements I{{className}}> {
    constructor(attributes: Partial<I{{className}}> = {}) {
        super(attributes);
    }

    // Implementasi interface

    // Tambahkan relasi manual di sini jika diperlukan
}
```

### Contoh Model

```ts
import { Model } from "@/utils/model/Model";
import { Post } from "./Post";
import { Role } from "./Role";

export interface IUser {
    id: number;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
}

export class User extends Model<IUser> implements IUser {
    constructor(attributes: Partial<IUser> = {}) {
        super(attributes);
    }

    // Implementasi interface
    id: number;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;

    // Tambahkan relasi manual di sini jika diperlukan
    posts() {
        return this.hasMany(Post);
    }

    roles() {
        return this.belongsToMany(Role, 'role_user');
    }
}
```

### Contoh Query Builder

```ts
import User from '@/app/models/User';

// Mengambil semua user dengan role 'admin'
const users = await User.where('role', 'admin').get();
console.log(users);

// Mengambil semua user yang id-nya tidak sama dengan 1 beserta relasi roles
const id = 1;
const usersWithRoles = await User.with("roles").whereNot({ id }).get();
console.log(usersWithRoles);
```

## Controller

Untuk membuat controller baru, gunakan perintah berikut:

```sh
npm run make:controller path/NamaController
```

### Contoh Implementasi Controller

```ts
import { Role } from "@/app/models/Role";
import { ControllerAction } from "@/utils/References";

export class RoleController {
    static index: ControllerAction = async (req, res) => {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const perPage = 5;

        const pagination = await Role.whereNot({ id: 1 }).paginate(page, perPage);

        res.render("roles/index", { pagination });
    }

    static create: ControllerAction = (req, res) => {
        res.render("roles/create");
    }

    static store: ControllerAction = async (req, res) => {
        await Role.create(req.body);
        req.flash("success", "New role has been created!");
        res.redirect("/roles");
    }

    static edit: ControllerAction = async (req, res) => {
        res.render("roles/edit", { role: await Role.find(req.params.id) });
    }

    static update: ControllerAction = async (req, res) => {
        await Role.where({ id: parseInt(req.params.id) }).update({ name: req.body.name });
        req.flash("success", "Role has been updated!");
        res.redirect("/roles");
    }

    static delete: ControllerAction = async (req, res) => {
        await Role.where({ id: parseInt(req.params.id) }).delete();
        req.flash("success", "Role has been deleted!");
        res.redirect("/roles");
    }
}
```


## Routing

EloTS menggunakan sistem routing mirip dengan [Laravel](https://laravel.com).

### Definisi Router

EloTS memiliki objek `Router` yang digunakan untuk mendefinisikan route dengan berbagai metode HTTP.

#### Metode Routing Dasar
Metode berikut digunakan untuk menangani berbagai jenis request HTTP:
- `get(path, ...middlewares, controllerAction)` → Menangani request GET
- `post(path, ...middlewares, controllerAction)` → Menangani request POST
- `put(path, ...middlewares, controllerAction)` → Menangani request PUT
- `patch(path, ...middlewares, controllerAction)` → Menangani request PATCH
- `delete(path, ...middlewares, controllerAction)` → Menangani request DELETE
- `options(path, ...middlewares, controllerAction)` → Menangani request OPTIONS

#### Grouping Route
Route dapat dikelompokkan dengan menggunakan metode `group(prefix, callback, middlewares)`, sehingga middleware atau prefix dapat diterapkan ke beberapa route sekaligus.

```ts
router.group('/admin', (router) => {
    router.get('/dashboard', AdminController.dashboard);
    router.get('/settings', AdminController.settings);
}, [adminOnly]);
```

#### Resource Route
EloTS menyediakan metode `resource()` untuk membuat route CRUD secara otomatis:

```ts
router.resource('posts', PostController);
```

Metode `except()` dapat digunakan untuk mengecualikan metode tertentu:

```ts
router.resource('posts', PostController).except('show');
```

#### API Resource
Untuk API, gunakan `apiResource()` yang menghasilkan route tanpa view:

```ts
router.apiResource('users', UserController);
```

### Contoh Routing Web

```ts
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

router.group('/', router => {
    router.get('/dashboard', DashboardController.index);
    router.resource('posts', PostController);
    
    router.group('/', router => {
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
            .addRequest(['store', 'update'], RoleRequest);
    }, [adminOnly]);
}, [webAuth]);

export const webRoutes = router.router;
```

Dengan sistem routing ini, EloTS memungkinkan pengelolaan route yang lebih terstruktur dan fleksibel menggunakan middleware, grup route, serta validasi request.

Gunakan perintah `npm run route:list` untuk melihat daftar route yang dihasilkan

# Scaffolding

## Pendahuluan
Fitur baru dalam framework EloTS dirancang untuk mempermudah pembuatan model, migrasi, dan seeder secara otomatis dari database yang sudah ada. Hal ini sangat berguna untuk studi kasus dengan jumlah tabel yang besar. Dengan perintah berikut, pengguna dapat melakukan scaffold dengan cepat:

- `npm run scaffold`: Membuat file model dan migrasi dari database yang ada.
- `npm run scaffold:seeder`: Membuat file seeder berdasarkan data yang sudah ada di database.

Namun, fitur ini hanya akan bekerja optimal jika struktur tabel mengikuti aturan dasar dari [Laravel](https://laravel.com), seperti:
- Nama tabel dalam bentuk plural (jamak dalam bahasa inggris) dan satu kata.
- Menggunakan kolom `id` sebagai primary key dengan auto increment.
- Tidak mengandung relasi many-to-many secara langsung.

Jika ada relasi many-to-many, model yang dihasilkan perlu ditinjau dan diperbaiki secara manual.

## Contoh Penggunaan
### 1. Contoh File Migrasi
Berikut contoh file migrasi yang dihasilkan oleh fitur scaffold:

#### `src/database/migrations/RolesTable.ts`
```typescript
import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class RolesTable {
    static async up() {
        await Schema.create('roles', (table) => {
            table.id();
            table.string('name').nullable();
            table.timestamp('created_at').default('CURRENT_TIMESTAMP', true);
            table.timestamp('updated_at').default('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', true);
        });
    }

    static async down() {
        await Schema.drop('roles');
    }
}
```

### 2. Contoh File Seeder
Berikut contoh file seeder yang dihasilkan:

#### `src/database/seeders/RoleSeeder.ts`
```typescript
import 'module-alias/register';
import { Role } from "@/app/models/Role";

export class RoleSeeder {
    static async run() {
        await Role.insert([
            {
                "id": 1,
                "name": "admin",
                "created_at": "2025-02-07T10:08:32.000Z",
                "updated_at": "2025-02-07T10:08:32.000Z"
            }
        ]);
    }
}
```

Untuk tabel pivot, file seeder akan dihasilkan tanpa model:

#### `src/database/seeders/RoleUserSeeder.ts`
```typescript
import 'module-alias/register';
import { MYSQL as DB } from "@/utils/database/DB";

export class RoleUserSeeder {
    static async run() {
        const records = [
            {
                "id": 1,
                "user_id": 1,
                "role_id": 1,
                "created_at": "2025-02-07T17:08:55.000Z",
                "updated_at": "2025-02-12T07:31:06.000Z"
            }
        ];
        let keys = Object.keys(records[0]);
        let values = records
            .map(row => (`(${keys.map(key => JSON.stringify(row[key])).join(", ")})`))
            .join(",\n        ");

        await DB.execute(`INSERT INTO role_user (${keys.join(", ")}) VALUES
        ${values};`);
    }
}
```

### 3. Menjalankan Seeder
Semua seeder yang telah dibuat harus dikonfigurasikan pada file `DatabaseSeeder.ts` sebelum dijalankan:

#### `src/database/seeders/DatabaseSeeder.ts`
```typescript
import "module-alias/register";
import { MYSQL as DB } from "@/utils/database/DB";
import { PostSeeder } from "./PostSeeder";
import { RoleUserSeeder } from "./RoleUserSeeder";
import { RoleSeeder } from "./RoleSeeder";
import { UserSeeder } from "./UserSeeder";

(async () => {
    const seeders = [
        PostSeeder,
        RoleUserSeeder,
        RoleSeeder,
        UserSeeder
    ];

    for (const seeder of seeders) {
        await seeder.run();
    }

    await DB.end().finally(() => {
        console.log('\x1b[34m%s\x1b[0m', '✔ Database telah terisi');
    });
})();
```

## Validasi Form Request
Fitur validasi dalam EloTS saat ini masih menggunakan `zod`, yang mungkin kurang ramah bagi pemula. Berikut contoh file validasi input:

#### `src/validators/RegisterValidator.ts`
```typescript
import { User } from "@/app/models/User";
import { Validator } from "@/utils/Validator";
import { z } from "zod";

class RegisterValidator extends Validator {
    rules() {
        return z.object({
            email: z.string().email(),
            password: z.string().min(6),
            password_confirmation: z.string(),
        }).superRefine(async (data, ctx) => {
            if (data.password !== data.password_confirmation) {
                ctx.addIssue({
                    path: ["password_confirmation"],
                    message: "Password confirmation doesn't match",
                    code: "custom"
                });
            }

            const user = await User.where("email", data.email).first();
            if (user) {
                ctx.addIssue({
                    path: ["email"],
                    message: "Email already taken",
                    code: "custom"
                });
            }
        });
    }
}

export const RegisterRequest = new RegisterValidator().validate;
```

### Menggunakan Validasi di Router
File validasi ini harus dikonfigurasikan sebagai middleware dalam router:

```typescript
router.post('/register', RegisterRequest, AuthController.register);
```

## Catatan
Fitur scaffold dalam EloTS masih dalam tahap eksperimen dan akan terus dikembangkan. Kami berharap dapat menemukan kontributor yang kompeten untuk membantu menyempurnakannya. Jika Anda tertarik, silakan berkontribusi melalui repository resmi framework ini!




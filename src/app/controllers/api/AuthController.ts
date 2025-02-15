import { IUser, User } from '@/app/models/User';
import { addToBlacklist } from '@/utils/Blacklist';
import { ControllerAction } from '@/utils/References';
import { Response } from '@/utils/http/Response';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export class AuthController {
    public static login: ControllerAction = async (req, res) => {
        if (!req.body?.email || !req.body?.password) {
            return res.status(400).json(Response.error('Email dan password harus diisi'));
        }

        const { email, password } = req.body;

        try {
            // Cari pengguna di database
            const user = await User.where({ email }).first()

            if (!user) {
                return res.status(400).json(Response.error('Email tidak ditemukan'));
            }

            // Bandingkan password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json(Response.error('Password salah'));
            }

            // Buat token JWT
            const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
            const token = await new SignJWT({ userId: user.id })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime(process.env.SESSION_TIMEOUT)
                .sign(secret);

            res.json(Response.success('Login berhasil', { token }));
        } catch (error) {
            console.error(error);
            res.status(500).json(Response.error('Terjadi kesalahan server'));
        }
    }


    // Fungsi untuk blacklist token setelah logout
    static logout: ControllerAction = async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];

            addToBlacklist(token);

            res.status(200).json(Response.success('Berhasil logout'));
        } catch (error) {
            console.error(error);
            res.status(500).json(Response.error('Terjadi kesalahan server'));
        }
    }

}

export default AuthController;

import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string | number;
    flash: Flash;
  }
  interface Flash {
    (type: string, message?: string | string[]): { [key: string]: string[]; };
    (type: string, message?: object): { [key: string]: string[]; }; // Menambahkan dukungan objek
  }
}
import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string | number;
    roles?: string[];
    tahun_buku?: number;
  }
}

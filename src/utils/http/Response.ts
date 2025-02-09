import { Paginator } from "../model/Paginator";

export class Response {

    success: boolean;
    message: string;
    data: any;
    error: any;
    pagination: Paginator<any>;
    meta: any;

    constructor(success: boolean, message: string, data?: any, error?: any, pagination?: Paginator<any>, meta?: any) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
        this.pagination = pagination || new Paginator();
        this.meta = meta;
    }

    static success(message: string, data?: any, pagination?: any, meta?: any) {

        // jika data adalah instance dari Model
        if (data && data.constructor.name === 'Model') {
            data = JSON.parse(JSON.stringify(data));
        }

        return new Response(true, message, data, null, pagination, meta);
    }

    static error(message: string, error?: any, meta?: any) {
        return new Response(false, message, null, error, null, meta);
    }
}
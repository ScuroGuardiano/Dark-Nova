import { Request } from 'express';
export interface NovaSession {
    reset(): void;
    userId?: string;
    [key: string]: any;
}
export interface NovaRequest extends Request {
    novaSession: NovaSession
}

import { Request } from 'express';
export interface NovaSession {
    userId?: string;
    reset(): void;
    [key: string]: any;
}
export interface NovaRequest extends Request {
    novaSession: NovaSession;
}

import { Response } from 'express';
import User from "@db/models/user";

export default interface APIResponse extends Response {
    locals: {
        [key: string]: any;
        user?: User;
    };
}
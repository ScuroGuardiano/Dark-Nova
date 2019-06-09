import { Response } from 'express';
import User from "@db/models/user";
import NovaCore from '@core/nova-core';

export default interface APIResponse extends Response {
    locals: {
        [key: string]: any;
        user?: User;
        core?: NovaCore;
    };
}
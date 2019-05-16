import { Router, Request, Response } from 'express';
import { NextFunction } from 'connect';
import logger from '../logger';
import { inspect } from 'util';
import createAPIV1Router from './v1';

export default async function createAPIRouter() {
    const router = Router();
    router.use('/v1', await createAPIV1Router());

    router.use((req, res) => {
        return res.status(404).json({
            statusCode: 404,
            error: "NOT_FOUND"
        });
    });
    router.use((err: any, req: Request, res: Response, next: NextFunction) => {
        logger.error("API: Unhandled API Error: %s", inspect(err));
        return res.status(500).json({
            statusCode: 500,
            error: "INTERNAL_ERROR"
        });
    });
    return router;
}

import { Router }  from "express";
import * as ServerSessions from "server-sessions";
import APIRequest from "./interfaces/api-request";
import auth from "./auth";
import game from './game';

async function initSessionManager(): Promise<ServerSessions.SessionManager> {
    return ServerSessions.init<{ userId: string }>({
        storagePath: "./apisessions.sqlite"
    });
}

export default async function createAPIV1Router() {
    const router = Router();
    const sessionManager = await initSessionManager();

    //inject session manager
    router.use((req: APIRequest, res, next) => {
        req.sessionManager = sessionManager;
        next();
    });
    router.use('/auth', auth);
    router.use('/game', game);
    return router;
}

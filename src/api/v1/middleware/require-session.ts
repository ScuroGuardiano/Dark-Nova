import APIRequest from "../interfaces/api-request";
import { NextFunction } from "express";
import { SessionExpiredError, SessionNotFoundError } from "server-sessions";
import User from "@db/models/user";
import APIResponse from "../interfaces/api-response";
import logger from "@logger";

const unauthorizedError = {
    statusCode: 401,
    error: "UNAUTHORIZED"
};
/**
 * Checks if session exists and if it's valid it'll place user into res.locals.user.
 * If session does not exists or if it's invalid returns error with 401 status code.
 * Session token should be in header X-Nova-Token
 */
export default async function requireSession(req: APIRequest, res: APIResponse, next: NextFunction) {
    const token = req.header("x-nova-token");
    if(!token) {
        return res.status(401).json(unauthorizedError);
    }
    try {
        const session = await req.sessionManager.retrieveSession(token);
        const user = await User.findOne(session.userId);
        if(!user) {
            await req.sessionManager.removeSession(token);
            return res.status(401).json(unauthorizedError);
        }
        res.locals.user = user;
        return next();
    }
    catch(err) {
        if(err instanceof SessionNotFoundError) {
            return res.status(401).json(unauthorizedError);
        }
        if(err instanceof SessionExpiredError) {
            req.sessionManager.removeExpiredSessions().catch(err => {
                logger.error("Error while removing expired sessions %s", err);
            });
            return res.status(401).json(unauthorizedError);
        }
        //Uknown error, let's send it further
        next(err);
    }
}
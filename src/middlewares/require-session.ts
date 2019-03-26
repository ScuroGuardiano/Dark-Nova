import { NovaRequest } from "../typings";
import User from "../db/models/user";
import { inspect } from "util";
import logger from "../logger";
import { Response, NextFunction } from "express";

/**
 * Checking if session exists and if it's valid placing user into res.locals.user.
 * If session does not exists or if it's invalid,
 * resets the session and redirects to login page.
 */
export default async function requireSession(req: NovaRequest, res: Response, next: NextFunction) {
    if (req.novaSession.userId) {
        try {
            const user = await User.findOne(req.novaSession.userId);
            if (user) {
                res.locals.user = user;
                return next();
            }
        }
        catch (err) {
            logger.error("Error while checking session: %s", inspect(err));
            req.novaSession.reset();
            res.redirect('/');
        }
    }
    req.novaSession.reset();
    return res.redirect('/');
}

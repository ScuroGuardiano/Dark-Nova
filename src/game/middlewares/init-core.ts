import { NovaRequest } from "../../typings";
import NovaCore from "../core/nova-core";
import PlayerNotFound from "../core/errors/player-not-found";
import { Response, NextFunction } from 'express';

/**
 * Inits and loads **NovaCore** to **_res.locals.core_**
 */
export default async function initCore(req: NovaRequest, res: Response, next: NextFunction) {
    try {
        const core = new NovaCore(req.novaSession.userId);
        if(req.query.planetId) {
            await core.init(req.query.planetId);
        }
        else {
            await core.init();
        }
        res.locals.core = core;
        return next();
    }
    catch(err) {
        if(err instanceof PlayerNotFound) {
            return res.redirect("/game/createPlayer");
        }
        return next(err);
    }
}

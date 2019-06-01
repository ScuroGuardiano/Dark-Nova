import { NovaRequest } from "../../typings";
import NovaCore from "@core/nova-core";
import PlayerNotFound from "@core/errors/player-not-found";
import PlanetDoesNotBelongToPlayer from '@core/errors/planet-not-belong-to-player';
import { Response, NextFunction } from 'express';

/**
 * Inits and loads **NovaCore** to **_res.locals.core_**
 */
export default async function initCore(req: NovaRequest, res: Response, next: NextFunction) {
    try {
        const core = new NovaCore(req.novaSession.userId);
        if(req.query.planetId) {
            try {
                await core.init(req.query.planetId);
            }
            catch(err) {
                if(err instanceof PlanetDoesNotBelongToPlayer) {
                    /* This version of view must be idiot proof,
                    so if someone type wrong planetId, it wil load default planet */
                    await core.init();
                }
                else throw err;
            }
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

import APIRequest from "../interfaces/api-request";
import { NextFunction } from "express";
import APIResponse from "../interfaces/api-response";
import NovaCore from "@core/nova-core";
import PlayerNotFound from "@core/errors/player-not-found";
import PlanetDoesNotBelongToPlayer from "@core/errors/planet-not-belong-to-player";
import apiError from "../helpers/api-error";

/**
 * Inits and loads **NovaCore** to **_res.locals.core_**  
 * If planetId get param is specified, it will use it, if no, it will load first player planet  
 * **Requires** _User_ placed in **_res.locals.user_**  
 * Can return 2 errors, I think it's easy to understand what they mean :)
```js
    [{
        statusCode: 404,
        error: "PLAYER_NOT_FOUND"
    }, {
        statusCode: 403,
        error: "PLANET_DOES_NOT_BELONG_TO_PLAYER"
    }]
```
 */
export default async function initCore(req: APIRequest, res: APIResponse, next: NextFunction) {
    try {
        const user = res.locals.user;
        const core = new NovaCore(user.id);
        if(req.query.planetId) {
            await core.init(req.query.planetId);
        }
        else {
            await core.init();
        }
        res.locals.core = core;
        return next();
    }
    catch (err) {
        if(err instanceof PlayerNotFound) {
            return apiError(res, 404, "PLAYER_NOT_FOUND");
        }
        if(err instanceof PlanetDoesNotBelongToPlayer) {
            return apiError(res, 403, "PLANET_DOES_NOT_BELONG_TO_PLAYER");
        }
        //Uknown error, let's send it further
        return next(err);
    }
}

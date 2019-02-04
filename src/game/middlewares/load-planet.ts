import { NovaRequest } from "../../typings";
import { Response, NextFunction } from "express";
import Player from "../../db/models/player";
import logger from "../../logger";
import { inspect } from "util";
import { planetService } from "../services";
import { Errors as HomePlanetErrors } from '../services/home-planet';

/**
 * _**IMPORTANT**_  
 * _**Can insert new data to database**_  
 *   
 * * Loads planet specified by planetId query parameter.  
 * * Saves planet to _**res.locals.planet**_
 * * If there's no planetId parameter or it isn't correct it loads first planet.  
 * * If player doesn't have any planet it will create new home planet!  
 * * Requires player set in _**res.locals.player**_
 */
export default async function loadPlanet(req: NovaRequest, res: Response, next: NextFunction) {
    try {
        let player = res.locals.player as Player;
        if(req.query.planetId) {
            let planet = await planetService.getPlanetById(req.query.planetId);
            if(planet && planet.playerId === player.id) {
                res.locals.planet = planet;
                return next();
            }
        }
        //No planetId param or planetId is invalid
        {
            let planet = await planetService.getFirstPlanetForPlayerId(player.id);
            if (planet) {
                res.locals.planet = planet;
                return next();
            }
        }
        //Player doesn't have any planet, create new one
        let planet = await planetService.createNewPlanet(player.id, null, true);
        res.locals.planet = planet;
        return next();
    }
    catch (err) {
        if(err instanceof HomePlanetErrors.NoAvailableSystemsForHomePlanet) {
            res.render('game/universe-is-full');
        }
        return next(err);
    }
}

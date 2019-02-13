import { NovaRequest } from "../../typings";
import { Response, NextFunction } from "express";
import Planet from "../../db/models/planet";
import Updater from "../services/updater";


/**
 * _**IMPORTANT**_
 * _**Updating records in database!**_
 *
 * Updated planet.  
 * _**Requires planet under res.locals.planet**_
 */
export default async function updatePlanet(req: NovaRequest, res: Response, next: NextFunction) {
    try {
        let planet = res.locals.planet as Planet;
        let updater = new Updater(planet);
        updater.update();
        await planet.save();
        return next();
    }
    catch (err) {
        return next(err);
    }
}

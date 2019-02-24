import * as express from 'express';
import logger from '../logger';
import { NovaRequest } from '../typings';
import { inspect } from 'util';
import requireSession from '../middlewares/require-session';
import requirePlayer from './middlewares/require-player';
import { Errors as PlayerErrors } from './services/player';
import { playerService } from './services';
import loadPlanet from './middlewares/load-planet';
import { IResourcesAndEnergy } from './data-types/resources';
import Planet from '../db/models/planet';
import Calculator from './services/calculator';
import { getBuidingNameByKey } from './utils';
import BuildSheluder from './services/buildings/build-sheluder';
import BuildQueue from './services/buildings/build-queue';

const router = express.Router();

export default router;

router.use(requireSession);
// ==== ROUTES BELOW REQUIRE USER TO BE LOGGED IN!!! ====
router.get('/createPlayer', async (req: NovaRequest, res) => {
    return res.render('game/create-player');
});
router.post('/createPlayer', async (req: NovaRequest, res) => {
    try {
        if(req.body.nickname) {
            await playerService.createNewPlayer(res.locals.user.id, req.body.nickname);
            return res.redirect('/game/');
        }
        return res.render('game/create-player', { error: "You must type your nickname!" });
    }
    catch(err) {
        if(err instanceof PlayerErrors.InvalidNickname) {
            return res.render('game/create-player', {
                error: "Invalid nickname. Nickname should have 4-16 characters and contain only letters, numbers and max one space." 
            });
        }
        if(err instanceof PlayerErrors.NicknameIsInUse) {
            return res.render('game/create-player', { error: "This nickname is used by someone else" });
        }
        if(err instanceof PlayerErrors.UserAlreadyGotPlayer) {
            return res.redirect('/game/');
        }
        logger.error("Error while creating player: %s", inspect(err));
        return res.status(500).render('game/create-player', { error: "500 - Internal Error, try again later" });
    }
});

router.use(requirePlayer);
// ==== ROUTES BELOW REQUIRE PLAYER TO EXISTS!!! ====
router.use(loadPlanet);
// ==== ROUTES BELOW LOADS OR CREATES PLANET!!!! ====

router.get('/test-view', async (req: NovaRequest, res, next) => {
    return res.render('game/' + req.query.view);
})
router.get('/', async (req: NovaRequest, res, next) => {
    try {
        return res.render('game/index');
    }
    catch(err) {
        return next(err);
    }
});
router.get('/buildings', async (req: NovaRequest, res, next) => {
    try {
        let buildingsInfo = [] as { key: string, name: string, level: number, cost: IResourcesAndEnergy, buildTime: number }[];
        let calculator = new Calculator(res.locals.planet);
        (res.locals.planet as Planet).buildings.getBuildingsList().forEach(building => {
            let level = building.level;
            let name = getBuidingNameByKey(building.key);
            let cost = calculator.calculateCostForBuild(building.key, building.level);
            let buildTime = calculator.calculateBuildTime(cost, building.level);
            buildingsInfo.push({key: building.key, name, level, cost, buildTime});
        });
        let buildQueue = await (new BuildQueue(res.locals.planet)).toArray();
        return res.render('game/buildings', { buildings: buildingsInfo, buildQueue });
    }
    catch(err) {
        return next(err);
    }
});
router.post('/sheludeBuildTask', async (req: NovaRequest, res, next) => {
    try {
        if(!req.body.buildingName)
            return res.status(400).send("W łeb się puknij");
        let buildSheluder = new BuildSheluder(res.locals.planet);
        if(await buildSheluder.sheludeBuildTask(req.body.buildingName)) {
            return res.status(200).json({ result: "success" });
        }
        else {
            return res.status(200).json({ result: "failure" });
        }
    }
    catch(err) {
        return res.status(500).send("Internalu Erroru");
    }
});

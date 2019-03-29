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
import BuildingsCalculator from './services/buildings/buildings-calculator';
import { getBuidingNameByKey, getTechNameByKey } from './utils';
import BuildSheluder from './services/buildings/build-sheluder';
import BuildQueue from './services/buildings/build-queue';
import Player from '../db/models/player';
import ResearchCalculator from './services/research/research-calculator';
import ResearchQueue from './services/research/research-queue';
import ResearchSheluder from './services/research/research-sheluder';

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
        const buildingsInfo = [] as
            { key: string, name: string, level: number, cost: IResourcesAndEnergy, buildTime: number }[];
        const calculator = new BuildingsCalculator(res.locals.planet);
        (res.locals.planet as Planet).buildings.getBuildingsList().forEach(building => {
            const level = building.level;
            const name = getBuidingNameByKey(building.key);
            const cost = calculator.calculateCostForBuild(building.key, building.level);
            const buildTime = calculator.calculateBuildTime(cost, building.level);
            buildingsInfo.push({key: building.key, name, level, cost, buildTime});
        });
        const buildQueue = (await new BuildQueue(res.locals.planet).load()).toArray();
        return res.render('game/buildings', { buildings: buildingsInfo, buildQueue });
    }
    catch(err) {
        return next(err);
    }
});
router.get('/research', async(req: NovaRequest, res, next) => {
    try {
        const planet = res.locals.planet as Planet;
        const player = res.locals.player as Player;
        if(planet.buildings.laboratory <= 0) {
            return res.render('game/no-labo');
        }
        const researchInfo = [] as
            { key: string, name: string, level: number, cost: IResourcesAndEnergy, researchTime: number }[];
        const calculator = new ResearchCalculator(planet);
        player.research.getResearchList().forEach(research => {
            const level = research.level;
            const name = getTechNameByKey(research.key);
            const cost = calculator.calculateResearchCost(research.key, research.level);
            const researchTime = calculator.calculateResearchTime(cost);
            researchInfo.push({ key: research.key, name, level, cost, researchTime });
        });
        const researchQueue = (await new ResearchQueue(player).load()).toArray();
        return res.render('game/research', { technologies: researchInfo, researchQueue });
    }
    catch(err) {
        return next(err);
    }
});
router.post('/sheludeBuildTask', async (req: NovaRequest, res, next) => {
    try {
        if(!req.body.buildingName)
            return res.status(400).send("W łeb się puknij");
        const buildSheluder = new BuildSheluder(res.locals.planet);
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
router.post("/sheludeResearchTask", async(req: NovaRequest, res, next) => {
    try {
        if(!req.body.technologyName)
            return res.status(400).send("W łeb się puknij");
        const planet = res.locals.planet as Planet;
        const player = res.locals.player as Player;
        const researchSheluder = new ResearchSheluder(player, planet);
        if(await researchSheluder.sheludeResearchTask(req.body.technologyName)) {
            return res.status(200).json({ result: "success" });
        }
        return res.status(200).json({ result: "failure" });
    }
    catch(err) {
        return res.status(500).send("Internalu Erroru");
    }
})


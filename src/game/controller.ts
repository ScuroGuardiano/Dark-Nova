import * as express from 'express';
import logger from '../logger';
import { NovaRequest } from '../typings';
import { inspect } from 'util';
import requireSession from '../middlewares/require-session';
import requirePlayer from './middlewares/require-player';
import { Errors as PlayerErrors } from './services/player';
import { playerService } from './services';
import loadPlanet from './middlewares/load-planet';
import updatePlanet from './middlewares/update-planet';

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
router.use(updatePlanet);
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
        return res.render('game/buildings');
    }
    catch(err) {
        return next(err);
    }
});

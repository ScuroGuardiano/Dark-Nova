import * as express from 'express';
import logger from '../logger';
import { NovaRequest } from '../typings';
import { inspect } from 'util';
import requireSession from '../middlewares/require-session';
import requirePlayer from './middlewares/require-player';
import PlayerService, { Errors as PlayerErrors } from './services/player';

const router = express.Router();

export default router;

const playerService = new PlayerService();

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
router.get('/', async (req: NovaRequest, res) => {
    try {
        return res.render('game/index');
    }
    catch(err) {
        logger.error(inspect(err));
        res.status(500).send("<h1>500 - Internal Error</h1>");
    }
});

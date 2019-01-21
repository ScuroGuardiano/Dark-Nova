import * as express from 'express';
import logger from '../logger';
import { NovaRequest } from '../typings';
import User from '../db/models/user';
import { inspect } from 'util';

const router = express.Router();

export default router;

router.use(async function requireSession(req: NovaRequest, res, next) {
    if(req.novaSession.userId) {
        try {
            let user = await User.findOne(req.novaSession.userId);
            if(user)
               return next();
        }
        catch(err) {
            logger.error("Error while checking session: %s", inspect(err));
            req.novaSession.reset();
            res.redirect('/');
        }
    }
    req.novaSession.reset();
    return res.redirect('/');
});

router.get('/', async (req: NovaRequest, res) => {
    try {
        let user = await User.findOne(req.novaSession.userId);
        return res.render('game/index', { email: user.email });
    }
    catch(err) {
        logger.error(inspect(err));
        res.status(500).send("<h1>500 - Internal Error</h1>");
    }
});

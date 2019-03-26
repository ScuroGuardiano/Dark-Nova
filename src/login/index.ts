/*
8888888b.                   888           888b    888
888  "Y88b                  888           8888b   888
888    888                  888           88888b  888
888    888  8888b.  888d888 888  888      888Y88b 888  .d88b.  888  888  8888b.
888    888     "88b 888P"   888 .88P      888 Y88b888 d88""88b 888  888     "88b
888    888 .d888888 888     888888K       888  Y88888 888  888 Y88  88P .d888888
888  .d88P 888  888 888     888 "88b      888   Y8888 Y88..88P  Y8bd8P  888  888
8888888P"  "Y888888 888     888  888      888    Y888  "Y88P"    Y88P   "Y888888

Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import * as express from 'express';
import logger from '../logger';
import { inspect } from 'util';
import UserService, { Errors as UserErrors } from './service';
import { NovaRequest } from '../typings';

const router = express.Router();

export default router;

const loginService = new UserService();

router.get(['login', 'register'], (req, res) => {
    res.redirect('/');
});

router.post('/login', async (req: NovaRequest, res) => {
    try {
        if(!req.body.email && !req.body.password)
            return res.status(400).send("400 - Bad Request");

        const user = await loginService.authUser(req.body.email, req.body.password);
        req.novaSession.userId = user.id;
        return res.redirect('/');
    }
    catch(err) {
        if(err instanceof UserErrors.WrongEmailOrPassword) {
            return res.render('index', { loginError: "Wrong email or password" });
        }
        logger.error(inspect(err));
        res.status(500).send("<h1>500 - Internal Error</h1>");
    }
});
router.post('/register', async (req: NovaRequest, res) => {
    try {
        if(!req.body.email && !req.body.password)
            return res.status(400).send("400 - Bad Request");

        const user = await loginService.registerUser(req.body.email, req.body.password);
        req.novaSession.userId = user.id;
        return res.redirect('/');
    }
    catch(err) {
        if(err instanceof UserErrors.AccountAlreadyExists)
            return res.render('index', { registerError: "Account already exists" });
        if(err instanceof UserErrors.InvalidEmailFormat)
            return res.render('index', { registerError: "Invalid email format" });
        if(err instanceof UserErrors.InvalidPasswordFormat)
            return res.render('index', { registerError: "Invalid password format" });
        logger.error(inspect(err));
        res.status(500).send("<h1>500 - Internal Error</h1>");
    }
});
router.get('/logout', async (req: NovaRequest, res) => {
    req.novaSession.reset();
    return res.redirect('/');
});

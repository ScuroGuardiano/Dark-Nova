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
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import logger from './logger';
import * as http from 'http';
import * as clientSessions from 'client-sessions';
import authorization from './login';
import config from './config';

const SESSIONS_CONFIG = config.get("client-sessions");

const loggerSuccessStream = {
    write(message: string) {
        if(message.endsWith('\n'))
            message = message.substring(0, message.length - 1);
        logger.info(message);
    }
}
const loggerErrorStream = {
    write(message: string) {
        if (message.endsWith('\n'))
            message = message.substring(0, message.length - 1);
        logger.error(message);
    }
}

export default class Server {
    constructor(public host: string, public port: number) {
        this.app = express();
        this.configureServer();
        this.registerRoutes();
        this.registerRouters();
    }

    //Public methods
    public start(cb?: Function) {
        let callback = cb ? cb : () => {
            logger.info("Server is listening on %s:%d", this.host, this.port);
        }
        logger.info("Starting HTTP Server...");
        this.server = this.app.listen(this.port, this.host, callback);
        this.server.on('close', () => {
            logger.info("HTTP Server has been shutted down");
        });
    }
    public close(cb?: Function) {
        if(this.server && this.server.listening) {
            logger.info("Shutting down HTTP Server...");
            this.server.close(cb);
        }
        else {
            //Call callback anyway
            process.nextTick(cb);
        }
    }

    //Private properties
    private app: express.Application;
    private server: http.Server;

    //Private methods
    private configureServer() {
        this.app.set('view engine', 'ejs');
        this.configureMiddlewares();
    }
    private configureMiddlewares() {
        // ============= Mo(r)gan =============
        //For 4xx and 5xx error logging
        this.app.use(morgan('short', {
            stream: loggerErrorStream,
            skip(req, res) { return res.statusCode < 400 }
        }));
        //For 2xx and 3xx normal logging
        this.app.use(morgan('short', {
            stream: loggerSuccessStream,
            skip(req, res) { return res.statusCode > 400 }
        }));
        // ============= static files =============
        this.app.use("/public", express.static('./public'));
        // ============= body-parser =============
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        // ============= client-sessions =============
        this.app.use(clientSessions({
            duration: SESSIONS_CONFIG.duration,
            activeDuration: SESSIONS_CONFIG.activeDuration,
            secret: SESSIONS_CONFIG.secret,
            cookieName: "novaSession"
        }));
    }
    private registerRouters() {
        this.app.use('/', authorization);
    }
    private registerRoutes() {
        this.app.get(['/', '/index'], (req, res) => {
            res.status(200).render('index');
        });
    }
}

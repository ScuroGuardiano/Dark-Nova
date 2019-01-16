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

import * as dotenv from 'dotenv';
dotenv.config();
import printLogo from "./print-logo";
import Server from "./server";
import config, { configWarnings } from "./config";
import logger from './logger';
import * as colors from 'colors/safe';
import * as util from 'util';
import { initDatabase } from './db';
import waitForLogger from './logger/wait-for-logger';

class DarkNova {
    constructor() {
        this.server = new Server(config.get('host'), config.get("port"));
    }
    public async run() {
        this.setProcessListeners();
        this.printInfo();
        this.printConfigWarnings();
        await this.loadNeededModules();
        this.server.start();
    }
    ////////////////////////////////////////////////////////////////////////////
    private printConfigWarnings() {
        if(configWarnings.length == 0) {
            logger.info("No config warnings :)");
            return;
        }
        configWarnings.forEach(warning => {
            logger.warn(warning);
        });
    }
    private printInfo() {
        printLogo();
        console.log("\nBy Scuro Guardiano\n");
        if (config.get('env') === "development") {
            logger.info("Running in development mode!");
        }
        if (config.get('env') === "production") {
            logger.debug(colors.red("Running in production mode, you should set logging to 'info' in config!"));
        }
    }
    //Initializing and enabling all required libraries and modules, like database
    private async loadNeededModules() {
        logger.info("Connecting to database...")
        try {
            await initDatabase();
            logger.info("Connected to database!");
        }
        catch (err) {
            logger.error("Error while connecting to database %s", util.inspect(err));
            this.criticalShutdown();
        }
    }
    private setProcessListeners() {
        process.on('uncaughtException', err => {
            logger.error("CRITICAL ERROR: UNCAUGHT EXCEPTION!");
            logger.error(util.inspect(err));
            this.criticalShutdown();
        });
        process.on('unhandledRejection', err => {
            logger.error("CRITICAL ERROR: UNHANDLED PROMISE REJECTION!")
            logger.error(util.inspect(err));
            this.criticalShutdown();
        })
        process.on('SIGINT', () => {
            logger.info("Caught interrupt signal.");
            this.shutdown();
        });
        process.on("SIGTERM", () => {
            logger.info("Caught interrupt singal.");
            this.shutdown();
        })
    }
    private criticalShutdown() {
        logger.error("SHUTTING DOWN DUE TO CRITICAL ERROR...");
        this.shutdown();
    }
    private shutdown() {
        if (this.shuttingDown) //prevent from invoking shutdown function more than once
            return;
        this.shuttingDown = true;
        logger.info("Shutting down Dark Nova...");
        this.server.close(async () => {
            waitForLogger(logger).then(() => {
                process.exit(0);
            });
        });
    }
    private server: Server;
    private shuttingDown = false;
}

module.exports = async function main() {
    let darkNova = new DarkNova();
    darkNova.run();
}

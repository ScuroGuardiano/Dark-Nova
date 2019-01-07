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
import config from "./config";
import logger from './logger';
import * as colors from 'colors/safe';

function printInfo() {
    printLogo();
    console.log("\nBy Scuro Guardiano\n");
    if(config.get('env') === "development") {
        logger.info("Running in development mode!");
    }
    if(config.get('env') === "production") {
        logger.debug(colors.red("Running in production mode, you should set logging to 'info' in config!"));
    }
}

module.exports = async function main() {
    printInfo();
    let server = new Server(config.get('host'), config.get("port"));
    server.start(() => {
        logger.info("Server is listening on %s:%d", server.host, server.port);
    })
}

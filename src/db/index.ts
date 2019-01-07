import config from "../config";
import * as Sequelize from 'sequelize';
import defineUserModel from "./models/user";
import logger from "../logger";
import winston = require("winston");

let db: Sequelize.Sequelize;
const dbConfig = config.get("db");
let dbLogging: boolean | winston.LeveledLogMethod = dbConfig.logging;

if(dbLogging) {
    //In production enviroment turn off logging, even it is set to true in config
    if (config.get('env') === "production") {
        logger.warn("Database logging can't be turned on in production enviroment, it has been turned off");
        dbLogging = false;
    }
    //In development enviroment
    else {
        dbLogging = logger.debug;
    }
}

if(dbConfig.dialect === "sqlite") {
    db = new Sequelize('mainDB', null, null, {
        dialect: "sqlite",
        storage: dbConfig.storage,
        logging: dbLogging,
        operatorsAliases: false
    });
}
else {
    db = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
        dialect: dbConfig.dialect,
        host: dbConfig.host,
        port: dbConfig.port,
        logging: dbLogging,
        operatorsAliases: false
    });
}

// Models
const User = defineUserModel(db);

// Associations

// Export models
export { User };
export { IUserAttributes, IUserInstance } from './models/user';

export async function initDatabase() {
    await db.sync({force: false});
}

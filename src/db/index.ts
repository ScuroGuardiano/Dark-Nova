import config from "../config";
import * as Sequelize from 'sequelize';
import defineUserModel from "./models/user";

let db: Sequelize.Sequelize;
const dbConfig = config.get("db");
if(dbConfig.dialect === "sqlite") {
    db = new Sequelize('mainDB', null, null, {
        dialect: "sqlite",
        storage: dbConfig.storage,
        logging: dbConfig.logging
    });
}
else {
    db = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
        dialect: dbConfig.dialect,
        host: dbConfig.host,
        port: dbConfig.port,
        logging: dbConfig.logging
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
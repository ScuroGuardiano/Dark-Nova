import { Logger } from 'typeorm';
import logger from './../logger';

export default class DatabaseLogger implements Logger {
    public logQuery(query: string) {
        logger.debug(`<DATABASE> Query: ${query}`);
    }
    public logQueryError(error: string, query: string) {
        logger.error(`<DATABASE> Error: ${error} in query: ${query}`);
    }
    public logQuerySlow() {}
    public logSchemaBuild() {}
    public logMigration() {}
    public log(level: "log" | "info" | "warn", message: any) {
        switch(level) {
            case "info":
            case "log":
                logger.info(`<DATABASE> ${message}`);
                break;
            case "warn":
                logger.warn(`<DATABASE> ${message}`);
        }
    }
}

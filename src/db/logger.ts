import { Logger } from 'typeorm';
import logger from './../logger';

export default class DatabaseLogger implements Logger {
    logQuery(query: string) {
        logger.debug(`<DATABASE> Query: ${query}`);
    }
    logQueryError(error: string, query: string) {
        logger.error(`<DATABASE> Error: ${error} in query: ${query}`);
    }
    logQuerySlow() {}
    logSchemaBuild() {}
    logMigration() {}
    log(level: "log" | "info" | "warn", message: any) {
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

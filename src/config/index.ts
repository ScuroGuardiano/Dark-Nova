import * as convict from 'convict';
import * as colors from 'colors/safe';

const config = convict({
    env: {
        doc: "The application enviroment",
        format: ["production", "development"],
        default: "development",
        env: "NODE_ENV",
        arg: "env"
    },
    host: {
        doc: "Server host",
        format: "ipaddress",
        default: "127.0.0.1",
        env: "HOST",
        arg: "host"
    },
    port: {
        doc: "Server port",
        format: "port",
        default: 1337,
        env: "PORT",
        arg: "port"
    },
    logging: {
        doc: "Logging level",
        format: ["error", "warn", "verbose", "info", "debug", "silly"],
        default: "debug",
        env: "LOGGING_LEVEL"
    },
    exposeAPI: {
        doc: "Expose API routes",
        format: [true, false],
        default: false,
        env: "EXPOSE_API"
    },
    db: {
        dialect: {
            doc: "Database dialect (sqlite, mysql, postgres, mssql)",
            format: ["sqlite", "mysql", "postgres", "mssql"],
            default: "sqlite",
            env: "DB_DIALECT",
            arg: "db-dialect"
        },
        storage: {
            doc: "SQLite only, where to store database",
            format: "*",
            default: "./db.sqlite",
            env: "SQLITE_STORAGE",
            arg: "sqlite-storage"
        },
        name: {
            doc: "Database name",
            format: "*",
            default: "darknova",
            env: "DB_NAME",
            arg: "db-name"
        },
        user: {
            doc: "Database username",
            format: "*",
            default: "root",
            env: "DB_USER",
            arg: "db-user"
        },
        password: {
            doc: "Database password",
            format: "*",
            default: null,
            env: "DB_PASSWORD",
            arg: "db-password"
        },
        host: {
            doc: "Database host",
            format: "*",
            default: "localhost",
            env: "DB_HOST",
            arg: "db-host"
        },
        port: {
            doc: "Database port",
            format: "port",
            default: null,
            env: "DB_PORT",
            arg: "db-port"
        },
        logging: {
            doc: "Sequelize logging",
            format: Boolean,
            default: false,
            env: "DB_LOGGING",
            arg: "db-logging"
        }
    },
    "client-sessions": {
        secret: {
            doc: "Secret to encrypt client sessions cookies",
            format: "*",
            default: Math.random().toString(),
            env: "SESSION_SECRET"
        },
        duration: {
            doc: "Session duration",
            format: "timestamp",
            default: 24 * 60 * 60 * 1000,
            env: "SESSION_DURATION"
        },
        activeDuration: {
            doc: "Session active duration, if duration < activeDuration then duration = activeDuration",
            format: "timestamp",
            default: 60 * 60 * 1000,
            env: "SESSION_ACTIVE_DURATION"
        }
    },
});

const configWarnings: Array<string> = [];

try {
    config.loadFile('./config/' + config.get('env') + '.json');
}
catch(err) {
    configWarnings.push(colors.red(`====================== CONFIGURATION LOADER ======================
==== Did not find configuration file for ${config.get("env")}.
==== You should create file ${config.get('env')}.json in config directory!
==== You'll find schema in file src/config/index.js\n`));
}
if (config.get("client-sessions").secret == config.default("client-sessions.secret")) {
    configWarnings.push(colors.red(`[IMPORTANT] client-sessions secret isn't set!!! Set secret in config or set env variable SESSION_SECRET!!!`));
}

export default config;
export { configWarnings };
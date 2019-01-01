import * as convict from 'convict';
import * as colors from 'colors/safe';

let config = convict({
    env: {
        doc: "The application enviroment",
        format: ["production", "dev"],
        default: "dev",
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
            default: "mainDB",
            env: "DB_NAME",
            arg: "db-name"
        },
        user: {
            doc: "Database username",
            format: "*",
            default: null,
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
            default: 3306,
            env: "DB_PORT",
            arg: "db-port"
        }
    }
});

try {
    config.loadFile('./config/' + config.get('env') + '.json');
}
catch(err) {
    console.error(colors.red(`====================== CONFIGURATION LOADER ======================
==== Did not find configuration file for ${config.get("env")}.
==== You should create file ${config.get('env')}.json in config directory!
==== You'll find schema in file src/config/index.js\n`));
}

export default config;
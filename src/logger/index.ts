/*
Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import { createLogger, format, transports } from 'winston';
import config from '../config';
import * as colors from 'colors';

const consoleFormat = format.printf(data => {
    const timestamp = colors.magenta(`${data.timestamp}`);
    return `[${timestamp} ${data.level}]: ${data.message}`;
});

const fileFormat = format.printf(data => {
    return `[${data.timestamp} ${data.level.toUpperCase()}]: ${data.message}`;
});

const logger = createLogger({
    level: config.get('logging'),
    transports: [
        new transports.Console({
            format: format.combine(
                format.splat(),
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                format.colorize(),
                consoleFormat
            )
        }),
        new transports.File({
            filename: `./logs/error.log`,
            level: "warn",
            format: format.combine(
                format.splat(),
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
                format.uncolorize(),
                fileFormat
            )
        }),
        new transports.File({
            filename: `./logs/log.log`,
            format: format.combine(
                format.splat(),
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
                format.uncolorize(),
                fileFormat
            )
        })
    ]
});

export default logger;
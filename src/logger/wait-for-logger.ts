// Need this function, because winston is fuckin retarded, and logger.on('finish')
// is not waiting for all transports

import { Logger } from 'winston';

export default function waitForLogger(l: Logger) {
    return new Promise(resolve => {
        console.log("Waiting 2.5s before close, to flush all logs, BECAUSE WINSTON IS RETARDED AND ON('FINISH') ISN'T WORKING PROPELY");
        setTimeout(resolve, 2500);
    });
}

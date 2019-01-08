import BasicError from "./basic-error";
import { inspect } from 'util';

export default class UknownError extends BasicError {
    constructor(err?: string) {
        super("Uknown Error" + err ? `: ${inspect(err)}` : "");
    }
}

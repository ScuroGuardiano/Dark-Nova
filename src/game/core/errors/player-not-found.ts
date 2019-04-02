import BasicError from "../../../errors/basic-error";

export default class PlayerNotFound extends BasicError {
    constructor() {
        super("Player not found");
    }
}

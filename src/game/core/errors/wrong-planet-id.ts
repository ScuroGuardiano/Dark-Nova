import BasicError from "../../../errors/basic-error";

export default class WrongPlanetId extends BasicError {
    constructor() {
        super("Wrong planet ID");
    }
}

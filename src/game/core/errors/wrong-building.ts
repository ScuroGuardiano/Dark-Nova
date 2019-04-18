import BasicError from "errors/basic-error";

export default class WrongBuilding extends BasicError {
    constructor(buildingName: string) {
        super(`Building: ${buildingName} doesn't exists.`);
    }
}

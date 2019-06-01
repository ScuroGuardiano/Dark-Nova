import BasicError from "../../../errors/basic-error";

export default class PlanetDoesNotBelongToPlayer extends BasicError {
    constructor(planetId: number, playerId: number) {
        super(`Planet ${planetId} does not belong to player ${playerId}!`);
    }
}

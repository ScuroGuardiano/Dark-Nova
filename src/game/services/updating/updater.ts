import { Transaction, TransactionManager, EntityManager } from "typeorm";
import Planet from "../../../db/models/planet";
import BuildQueue from "../buildings/build-queue";
import { PureUpdater } from "./pure-updater";
import logger from "../../../logger";
import BuildTask from "../../../db/models/build-task";
import Player from "../../../db/models/player";
import ResearchQueue from "../research/research-queue";

export default class Updater {
    constructor(private planetId: number) {}
    
    @Transaction({isolation: "SERIALIZABLE"})
    public async fullUpdatePlanet(@TransactionManager() manager?: EntityManager): Promise<{player: Player, planet: Planet}> {
        let planet = await manager.findOne(Planet, this.planetId);
        if(!planet) return null;
        let player = await manager.findOne(Player, planet.playerId);

        let buildQueue = new BuildQueue(planet);
        let researchQueue = new ResearchQueue(player);
        await Promise.all([
            buildQueue.load(manager),
            researchQueue.load(manager)
        ]);
        let pureUpdater = new PureUpdater(player, planet);

        pureUpdater.update(buildQueue, researchQueue); //THE BIG UPDATE XD

        this.logFailed(pureUpdater.failedToShelude, planet);
        //TODO: Make function that will send message to player about not enough resources
        await buildQueue.save(manager);
        await manager.save(planet);
        await manager.save(player);
        return { player, planet };
    }
    private logFailed(failed: BuildTask[], planet: Planet) {
        failed.forEach(task => 
            logger.debug(`${task.buildingName} on planet ${planet.id} failed to upgrade.`)
        );
    }
}
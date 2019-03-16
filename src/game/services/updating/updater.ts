import { Transaction, TransactionManager, EntityManager } from "typeorm";
import Planet from "../../../db/models/planet";
import BuildQueue from "../buildings/build-queue";
import { PureUpdater } from "./pure-updater";
import logger from "../../../logger";
import BuildTask from "../../../db/models/build-task";

export default class Updater {
    constructor(private planetId: number) {}
    
    @Transaction({isolation: "SERIALIZABLE"})
    public async fullUpdatePlanet(@TransactionManager() manager?: EntityManager): Promise<Planet> {
        let planet = await manager.findOne(Planet, this.planetId);
        if(!planet) return null;

        let buildQueue = new BuildQueue(planet);
        await buildQueue.load(manager);
        let pureUpdater = new PureUpdater(planet);

        pureUpdater.update(buildQueue); //THE BIG UPDATE XD

        this.logFailed(pureUpdater.failedToShelude, planet);
        //TODO: Make function that will send message to player about not enough resources
        await buildQueue.save(manager);
        await manager.save(planet);
        return planet;
    }
    private logFailed(failed: BuildTask[], planet: Planet) {
        failed.forEach(task => 
            logger.debug(`${task.buildingName} on planet ${planet.id} failed to upgrade.`)
        );
    }
}
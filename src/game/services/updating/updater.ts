import { Transaction, TransactionManager, EntityManager } from "typeorm";
import Planet from "../../../db/models/planet";
import BuildQueue from "../buildings/build-queue";
import { PureUpdater } from "./pure-updater";
import logger from "../../../logger";
import BuildTask from "../../../db/models/build-task";
import Player from "../../../db/models/player";
import ResearchQueue from "../research/research-queue";
import ResearchTask from "../../../db/models/research-task";

//Okey about how this updating works I could write a book, so let's say it's magic :3
export default class Updater {
    constructor(private planetId: number) {}
    
    @Transaction({isolation: "SERIALIZABLE"})
    public async fullUpdatePlanet(@TransactionManager() manager?: EntityManager): Promise<{player: Player, planet: Planet}> {
        let planet = await manager.findOne(Planet, this.planetId);
        if(!planet) return null;
        let player = await manager.findOne(Player, planet.playerId);

        let buildQueue = new BuildQueue(planet);
        this.researchQueue = new ResearchQueue(player);
        await Promise.all([
            buildQueue.load(manager),
            this.researchQueue.load(manager)
        ]);
        let pureUpdater = new PureUpdater(player, planet, buildQueue, this.researchQueue);
        pureUpdater.init();
        let finished = false;
        while(!finished) {
            finished = pureUpdater.startUpdate();
            if(!finished) {
                let researchTaskPlanetId = this.researchQueue.front().planetId;
                let succeed = await this.partialPlanetUpdate(manager, researchTaskPlanetId, player, pureUpdater.currentUpdaterTime);
                if(!succeed) {
                    //Probably research task is invalid, just get rid of it
                    this.researchQueue.pop();
                }
            }
        }

        this.logFailedBuildTasks(pureUpdater.failedBuildTasks, planet);
        this.logFailedResearchTasks(pureUpdater.failedResearchTasks, planet);
        //TODO: Make function that will send message to player about not enough resources
        await buildQueue.save(manager);
        await this.researchQueue.save(manager);
        await manager.save(planet);
        await manager.save(player);
        return { player, planet };
    }
    private async partialPlanetUpdate(manager: EntityManager, planetId: number, player: Player, targetTime: number) {
        let planet = await manager.findOne(Planet, planetId);
        if(!planet) return null;
        
        let buildQueue = new BuildQueue(planet);
        await buildQueue.load(manager);
        let pureUpdater = new PureUpdater(player, planet, buildQueue, this.researchQueue);
        pureUpdater.init(targetTime);
        pureUpdater.startUpdate(); //I don't need to check here if finished, because there shouldn't be any problematic research tasks to do.

        this.logFailedBuildTasks(pureUpdater.failedBuildTasks, planet);
        this.logFailedResearchTasks(pureUpdater.failedResearchTasks, planet);

        await buildQueue.save(manager);
        await manager.save(planet);
        return true;
    }
    private logFailedBuildTasks(failed: BuildTask[], planet: Planet) {
        failed.forEach(task => 
            logger.debug(`${task.buildingName} on planet ${planet.id} failed to upgrade.`)
        );
    }
    private logFailedResearchTasks(failed: ResearchTask[], planet: Planet) {
        failed.forEach(task =>
            logger.debug(`${task.researchName} on planet ${planet.id} failed to upgrade.`)
        );
    }
    private researchQueue: ResearchQueue;
}
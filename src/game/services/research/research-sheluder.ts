import Player from "../../../db/models/player";
import Planet from "../../../db/models/planet";
import { Transaction, TransactionManager, EntityManager } from "typeorm";
import logger from "../../../logger";
import ResearchQueue from "./research-queue";
import ResearchCalculator from "./research-calculator";
import { haveEnoughResources, subtractResources } from "../../utils";
import ResearchTask from "../../../db/models/research-task";

export default class ResearchSheluder {
    public constructor(private _player: Player, private _planet: Planet) {}

    /**
     * Performing ACID operation of adding new research task.
     * Loads player and planet again from DB in transaction,
     * then saves it to database if modified resources
     */
    @Transaction({ isolation: "SERIALIZABLE" })
    public async sheludeResearchTask(techName: string, @TransactionManager() manager?: EntityManager) {
        if(!this.checkIfValidResearchName(techName)) {
            logger.error("Research name: " + techName + " is invalid!");
            return false;
        }

        let [player, planet] = await this.loadPlayerAndPlanet(manager);
        const researchQueue = new ResearchQueue(player);
        await researchQueue.load(manager);

        if(researchQueue.isFull()) {
            logger.error("Can't create research task, the queue is full!");
            return false;
        }
        let calculator = new ResearchCalculator(planet);
        let techLevel = player.research[techName];

        if(researchQueue.isEmpty()) {
            //Queue is empty, job starts now
            let cost = calculator.calculateResearchCost(techName, techLevel);
            if(!haveEnoughResources(planet, cost))
                return false;
            
            let researchTime = calculator.calculateResearchTime(cost);
            let startTime = Date.now();
            let researchTask = ResearchTask.createNew(
                planet.id,
                player.id,
                techName,
                new Date(startTime),
                new Date(startTime + researchTime)
            );
            subtractResources(planet, cost);

            researchQueue.push(researchTask);
            //player didn't change, so we save only planet and queue
            await researchQueue.save(manager);
            await manager.save(planet);
            return true;
        }
        //Queue is not empty, so we only add task to queue, without taking resources.
        /* If there's pending task in queue, then we must use higher level,
        for example if you have metal mine on level 2 and two metal mine build task in queue
        then when those tasks will be finished, metal mine will be on level 4.*/

        /*TODO: Make it simpler and test it ^^, it doesn't have to determine time now, time just have to be higher than last task time
          Updater is calculating time again anyway. Also OGame shows time only for currently researching element, so
          knowing research time now is useless*/
        techLevel += researchQueue.countElementsForResearchName(techName);
        let cost = calculator.calculateResearchCost(techName, techLevel);
        let researchTime = calculator.calculateResearchTime(cost);
        let startTime = (researchQueue.back()).finishTime;

        let researchTask = ResearchTask.createNew(
            planet.id,
            player.id,
            techName,
            startTime,
            new Date(startTime.getTime() + researchTime)
        );
        researchQueue.push(researchTask);
        await researchQueue.save(manager);
        return true;
    }

    private async loadPlayerAndPlanet(manager: EntityManager) {
        let playerPromise = manager.findOne(Player, this._player.id);
        let planetPromise = manager.findOne(Planet, this._planet.id);
        return await Promise.all([playerPromise, planetPromise]);
    }

    private checkIfValidResearchName(researchName: string) {
        return this._player.research
            .getResearchList()
            .findIndex(v => v.key === researchName) != -1;
    }
}

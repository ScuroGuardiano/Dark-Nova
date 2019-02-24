import Planet from "../../../db/models/planet";
import logger from "../../../logger";
import BuildTask from "../../../db/models/build-task";
import { haveEnoughResources, subtractResources } from "../../utils";
import Calculator from "../calculator";
import { Transaction, TransactionManager, EntityManager } from "typeorm";
import BuildQueue from "./build-queue";

export default class BuildSheluder {
    constructor(private _planet: Planet) {}
    /**
     * Performing ACID operation of adding new build task.
     * Reloads planet from DB in transaction, 
     * then saves it to database if modified resources
     */
    @Transaction({ isolation: "SERIALIZABLE" })
    public async sheludeBuildTask(buildingName: string, @TransactionManager() manager?: EntityManager): Promise<boolean> {
        if(!this.checkIfValidBuildingName(buildingName)) {
            logger.error(`Error while creating build job: There's no building ${buildingName}!`);
            return false;
        }
        
        let planet = await manager.findOne(Planet, this._planet.id);
        const buildQueue = new BuildQueue(planet);
        buildQueue.useEntityManager(manager);

        if(await buildQueue.isFull()) {
            logger.error(`Trying to create build job while the queue if full!`);
            return false;
        }
        let calculator = new Calculator(planet);
        let buildingLevel = planet.buildings[buildingName];

        if(await buildQueue.isEmpty()) {
            //Queue is empty, so building job starts now. That means we must take resources now
            if(!this.checkPlanetFields(planet)) {
                logger.error(`Trying to create build job on full planet!`);
                return false; //Not enough fields on planet
            }
            let cost = calculator.calculateCostForBuild(buildingName, buildingLevel);
            if (!haveEnoughResources(planet, cost))
                return false;
            
                let buildTime = calculator.calculateBuildTime(cost, buildingLevel);
                let startTime = Date.now();
                let buildTask = BuildTask.createNew(
                    planet,
                    buildingName,
                    new Date(startTime),
                    new Date(startTime + buildTime)
                );
                subtractResources(planet, cost);

                await buildQueue.push(buildTask);
                await manager.save(planet);
            return true;
        }
        //Queue is not empty, so we only add task to queue, without taking resources.
        /* If there's pending task in queue, then we must use higher level, 
        for example if you have metal mine on level 2 and two metal mine build task in queue
        then when those tasks will be finished, metal mine will be on level 4.*/
        let buildingTasksInQueue = await buildQueue.length();
        if(!this.checkPlanetFields(planet, buildingTasksInQueue + 1)) {
            logger.error(`Trying to create build job on full planet!`);
            return false; //Not enough fields on planet
        }

        buildingLevel += await buildQueue.countElementsForBuilding(buildingName);
        let cost = calculator.calculateCostForBuild(buildingName, buildingLevel);
        let buildTime = calculator.calculateBuildTime(cost, buildingLevel);
        let startTime = (await buildQueue.back()).finishTime;

        let buildTask = BuildTask.createNew(planet,
            buildingName,
            startTime,
            new Date(startTime.getTime() + buildTime)
        );
        await buildQueue.push(buildTask);
        return true;
    }
    public sheludeDestroyTask(buildingName: string) {
        throw new Error("Not implemented");
    }
    private checkIfValidBuildingName(buildingName: string) {
        return this._planet.buildings
        .getBuildingsList()
        .findIndex(v => v.key === buildingName) != -1;
    }
    private checkPlanetFields(planet: Planet, neededFields: number = 1) {
        return (planet.usedFields + neededFields) <= planet.maxFields;
    }
}

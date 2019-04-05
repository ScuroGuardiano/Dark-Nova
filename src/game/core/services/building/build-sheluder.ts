import Planet from "../../../../db/models/planet";
import logger from "../../../../logger";
import BuildTask from "../../../../db/models/build-task";
import { haveEnoughResources, subtractResources } from "../../utils";
import BuildCalculator from "./build-calculator";
import { Transaction, TransactionManager, EntityManager } from "typeorm";
import BuildQueue from "./build-queue";

export default class BuildSheluder {
    constructor(private readonly _planet: Planet) {}
    /**
     * Performing ACID operation of adding new build task.
     * Loads planet again from DB in transaction,
     * then saves it to database if modified resources
     */
    @Transaction({ isolation: "SERIALIZABLE" })
    public async sheludeBuildTask(buildingName: string, @TransactionManager() manager?: EntityManager): Promise<boolean> {
        if(!this.checkIfValidBuildingName(buildingName)) {
            logger.error(`Error while creating build job: There's no building ${buildingName}!`);
            return false;
        }

        const planet = await manager.findOne(Planet, this._planet.id);
        const buildQueue = new BuildQueue(planet);
        await buildQueue.load(manager);

        if(buildQueue.isFull()) {
            logger.error(`Trying to create build job while the queue if full!`);
            return false;
        }
        const calculator = new BuildCalculator(planet);
        let buildingLevel = planet.buildings[buildingName];

        if(buildQueue.isEmpty()) {
            //Queue is empty, so building job starts now. That means we must take resources now
            if(!this.checkPlanetFields(planet)) {
                logger.error(`Trying to create build job on full planet!`);
                return false; //Not enough fields on planet
            }
            const cost = calculator.calculateCostForBuild(buildingName, buildingLevel);
            if (!haveEnoughResources(planet, cost))
                return false;

            const buildTime = calculator.calculateBuildTime(cost, buildingLevel);
            const startTime = Date.now();
            const buildTask = BuildTask.createNew(
                planet,
                buildingName,
                new Date(startTime),
                new Date(startTime + buildTime)
            );
            subtractResources(planet, cost);

            buildQueue.push(buildTask);
            await buildQueue.save(manager);
            await manager.save(planet);
            return true;
        }
        //Queue is not empty, so we only add task to queue, without taking resources.
        /* If there's pending task in queue, then we must use higher level,
        for example if you have metal mine on level 2 and two metal mine build task in queue
        then when those tasks will be finished, metal mine will be on level 4.*/
        const buildingTasksInQueue = buildQueue.length();
        if(!this.checkPlanetFields(planet, buildingTasksInQueue + 1)) {
            logger.error(`Trying to create build job on full planet!`);
            return false; //Not enough fields on planet
        }
        /*TODO: Make it simpler and test it ^^, it doesn't have to determine time now, time just have to be higher than last task time
          Updater is calculating time again anyway. Also OGame shows time only for currently building element, so
          knowing build time now is useless*/
        buildingLevel += buildQueue.countElementsForBuilding(buildingName);
        const cost = calculator.calculateCostForBuild(buildingName, buildingLevel);
        const buildTime = calculator.calculateBuildTime(cost, buildingLevel);
        const startTime = (buildQueue.back()).finishTime;

        const buildTask = BuildTask.createNew(planet,
            buildingName,
            startTime,
            new Date(startTime.getTime() + buildTime)
        );
        buildQueue.push(buildTask);
        await buildQueue.save(manager);
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
    private checkPlanetFields(planet: Planet, neededFields = 1) {
        return (planet.usedFields + neededFields) <= planet.maxFields;
    }
}

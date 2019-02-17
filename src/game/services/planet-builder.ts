import Planet from "../../db/models/planet";
import logger from "../../logger";
import BuildTask from "../../db/models/build-task";
import uniConfig from "../../config/uni-config";
import { haveEnoughResources, subtractResources } from "../utils";
import Calculator from "./calculator";
import { getConnection } from "typeorm";

export default class PlanetBuilder {
    constructor(private planet: Planet) {}

    public async sheludeBuildTask(buildingName: string): Promise<boolean> {
        if(!this.checkIfValidBuildingName(buildingName)) {
            logger.error(`Error while creating build job: There's no building ${buildingName}!`);
            return false;
        }
        if(!(await this.isQueueNotFull())) {
            logger.error(`Trying to create build job while the queue if full!`);
            return false;
        }
        let calculator = new Calculator(this.planet);
        let buildingLevel = this.planet.buildings[buildingName];

        if(await this.isQueueEmpty()) {
            //Queue is empty, so building job starts now. That means we must take resources now
            let cost = calculator.calculateCostForBuild(buildingName, buildingLevel);
            if (!haveEnoughResources(this.planet, cost))
                return false;
            
            subtractResources(this.planet, cost);
            let buildTime = calculator.calculateBuildTime(cost, buildingLevel);
            let startTime = Date.now();
            let buildTask = BuildTask.createNew(
                this.planet,
                buildingName,
                new Date(startTime),
                new Date(startTime + buildTime)
            );

            await getConnection().transaction(async transactionalEntityManager => {
                await transactionalEntityManager.save(this.planet);
                await transactionalEntityManager.save(buildTask);
            });
            return true;
        }
        //Queue is not empty, so we only add task to queue, without taking resources.
        /* If there's pending task in queue, then we must use higher level, 
        for example if you have metal mine on level 2 and two metal mine build task in queue
        then when those tasks will be finished, metal mine will be on level 4.
        */
        buildingLevel += await this.countPendingBuildTasksForBuilding(buildingName);
        let cost = calculator.calculateCostForBuild(buildingName, buildingLevel);
        let buildTime = calculator.calculateBuildTime(cost, buildingLevel);
        let startTime = await this.getLastTaskFinishTime();

        let buildTask = BuildTask.createNew(this.planet,
            buildingName,
            startTime,
            new Date(startTime.getTime() + buildTime)
        );
        await buildTask.save();
        return true;
    }
    public sheludeDestroyTask(buildingName: string) {
        throw new Error("Not implemented");
    }
    private checkIfValidBuildingName(buildingName: string) {
        return this.planet.buildings
        .getBuildingsList()
        .findIndex(v => v.key === buildingName) != -1;
    }
    private async isQueueNotFull() {
        const maxQueue = uniConfig.get('buildQueueLimit').normal; //TODO: Do here handling for commander
        let queueSize = await BuildTask.count({ planetId: this.planet.id });
        return queueSize < maxQueue;
    }
    private async isQueueEmpty() {
        return await BuildTask.count({ planetId: this.planet.id }) === 0;
    }
    private countPendingBuildTasksForBuilding(buildingName: string) {
        return BuildTask.count({ planetId: this.planet.id, buildingName: buildingName });
    }
    private async getLastTaskFinishTime() {
        let task = await BuildTask.findOne({
             where: { planetId: this.planet.id },
             order: { finishTime: "DESC" } 
        });
        return task.finishTime;
    }
}

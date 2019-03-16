import Planet from "../../../db/models/planet";
import BuildTask, { BuildTaskType } from "../../../db/models/build-task";
import BuildingsCalculator from "../buildings/buildings-calculator";
import { haveEnoughResources, subtractResources } from "../../utils";
import BuildQueue from "../buildings/build-queue";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

/**
 * This is Pure Updater, hell ye.  
 * I called it "pure" because it's not changing ANYTHING in database, it just changing numbers in memory  
 * Thanks this I can better control database access  
 */
export class PureUpdater {
    public constructor(private planet: Planet) { }
    public update(buildQueue: BuildQueue) {
        this.now = Date.now();
        const timeSinceLastUpdate = this.now - this.planet.lastUpdate.getTime();
        if (timeSinceLastUpdate <= 0)
            return this.planet;

        /** There's no buildings to build, so we can update only resources */
        if (buildQueue.length() === 0) {
            const hoursSinceLastUpdate = timeSinceLastUpdate / HOUR;
            this.updateResources(hoursSinceLastUpdate);
            this.planet.lastUpdate = new Date(this.now);
            return this.planet;
        }
        /** There are building to build, in the recursion loop I will update buildings and resources between builds :3 */

        this.updateTick(this.planet.lastUpdate.getTime(), buildQueue);

        this.planet.lastUpdate = new Date(this.now);
        return this.planet;
    }
    /**
     * One tick in update, explain on example:
     * > Last planet update was at 8:00PM, you have planned 2 Metal mine build tasks:
     * - Metal mine to level 20, finish at 8:30PM
     * - Metal mine to level 21, finish at 9:50PM
     * 
     * > As you see your metal production will increase at 8:30PM and then increase again at 9:50PM.
     * So we need to calculate producted metal from 8:00PM to 8:30PM and then again from 8:30PM to 9:50PM 
     * but now with increased production.
     * 
     * To do this I just used recursion
     */
    private updateTick(startTime: number, buildQueue: BuildQueue): void {
        let endTime = this.now;
        //If there's no building to build update resource to the current time and end updating
        if (buildQueue.length() === 0 || buildQueue.front().finishTime.getTime() > this.now) {
            let deltaHours = (endTime - startTime) / HOUR;
            this.updateResources(deltaHours);
            return;
        }
        endTime = buildQueue.front().finishTime.getTime();
        let deltaHours = (endTime - startTime) / HOUR;
        this.updateResources(deltaHours);
        this.updateBuilding(buildQueue.front());
        buildQueue.pop();
        this.setNextBuildTaskOnTop(endTime, buildQueue);
        this.planet.calculateEconomy(); //Recalculate economy details
        return this.updateTick(endTime, buildQueue);
    }
    private updateBuilding(buildTask: BuildTask) {
        if (buildTask.taskType == BuildTaskType.BUILD) {
            this.planet.buildings[buildTask.buildingName]++;
        }
        else if (buildTask.taskType == BuildTaskType.DESTROY) {
            this.planet.buildings[buildTask.buildingName]--;
        }
    }
    private setNextBuildTaskOnTop(startTime: number, buildQueue: BuildQueue) {
        if (buildQueue.length() === 0)
            return;
        if (buildQueue.front().taskType == BuildTaskType.BUILD) {
            let buildingName = buildQueue.front().buildingName;
            let calculator = new BuildingsCalculator(this.planet);
            let buildingLevel = this.planet.buildings[buildQueue.front().buildingName];
            let cost = calculator.calculateCostForBuild(buildingName, buildingLevel);
            if (!haveEnoughResources(this.planet, cost)) {
                this.failedToShelude.push(buildQueue.pop());
                return;
            }
            let buildTime = calculator.calculateBuildTime(cost, buildingLevel);

            //Times could changed by, e.g building nano factory or robotics factory
            buildQueue.front().startTime = new Date(startTime);
            buildQueue.front().finishTime = new Date(startTime + buildTime);
            subtractResources(this.planet, cost);
            return;
        }
        else if (buildQueue.front().taskType == BuildTaskType.DESTROY) {
            throw new Error("Not implemented");
        }
    }
    private updateResources(timestampInHours: number) {
        if (this.planet.metal < this.planet.metalStorage) {
            this.planet.metal += this.planet.metalPerHour * timestampInHours;
            if (this.planet.metal > this.planet.metalStorage)
                this.planet.metal = this.planet.metalStorage;
        }
        if (this.planet.crystal < this.planet.crystalStorage) {
            this.planet.crystal += this.planet.crystalPerHour * timestampInHours;
            if (this.planet.crystal > this.planet.crystalStorage)
                this.planet.crystal = this.planet.crystalStorage;
        }
        if (this.planet.deuter < this.planet.deuteriumStorage) {
            this.planet.deuter += this.planet.deuteriumPerHour * timestampInHours;
            if (this.planet.deuter > this.planet.deuteriumStorage)
                this.planet.deuter = this.planet.deuteriumStorage;
        }
    }
    private now: number;
    public failedToShelude: BuildTask[] = [];
}

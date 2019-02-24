import Planet from "../../../db/models/planet";
import BuildTask, { BuildTaskType } from "../../../db/models/build-task";
import Calculator from "../calculator";
import { haveEnoughResources, subtractResources } from "../../utils";

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
    public update(buildTaskList: Array<BuildTask>) {
        this.now = Date.now();
        const timeSinceLastUpdate = this.now - this.planet.lastUpdate.getTime();
        if (timeSinceLastUpdate <= 0)
            return this.planet;

        /** There's no buildings to build, so we can update only resources */
        if (buildTaskList.length === 0) {
            const hoursSinceLastUpdate = timeSinceLastUpdate / HOUR;
            this.updateResources(hoursSinceLastUpdate);
            this.planet.lastUpdate = new Date(this.now);
            return this.planet;
        }
        /** There are building to build, in the recursion loop I will update buildings and resources between builds :3 */

        this.updateTick(this.planet.lastUpdate.getTime(), buildTaskList);

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
    private updateTick(startTime: number, buildTaskList: Array<BuildTask>): void {
        let endTime = this.now;
        //If there's no building to build update resource to the current time and end updating
        if (buildTaskList.length === 0 || buildTaskList[0].finishTime.getTime() > this.now) {
            let deltaHours = (endTime - startTime) / HOUR;
            this.updateResources(deltaHours);
            return;
        }
        endTime = buildTaskList[0].finishTime.getTime();
        let deltaHours = (endTime - startTime) / HOUR;
        this.updateResources(deltaHours);
        this.updateBuilding(buildTaskList[0]);
        this.doneBuildTasks.push(buildTaskList.shift());
        this.setNextBuildTaskOnTop(endTime, buildTaskList);
        return this.updateTick(endTime, buildTaskList);
    }
    private updateBuilding(buildTask: BuildTask) {
        if (buildTask.taskType == BuildTaskType.BUILD) {
            this.planet.buildings[buildTask.buildingName]++;
        }
        else if (buildTask.taskType == BuildTaskType.DESTROY) {
            this.planet.buildings[buildTask.buildingName]--;
        }
    }
    private setNextBuildTaskOnTop(startTime: number, buildTaskList: Array<BuildTask>) {
        if (buildTaskList.length === 0)
            return;
        if (buildTaskList[0].taskType == BuildTaskType.BUILD) {
            let buildingName = buildTaskList[0].buildingName;
            let calculator = new Calculator(this.planet);
            let buildingLevel = this.planet.buildings[buildTaskList[0].buildingName];
            let cost = calculator.calculateCostForBuild(buildingName, buildingLevel);
            if (!haveEnoughResources(this.planet, cost)) {
                this.failedToShelude.push(buildTaskList.shift());
                return;
            }
            let buildTime = calculator.calculateBuildTime(cost, buildingLevel);

            //Times could changed by, e.g building nano factory or robotics factory
            buildTaskList[0].startTime = new Date(startTime);
            buildTaskList[0].finishTime = new Date(startTime + buildTime);
            subtractResources(this.planet, cost);
            return;
        }
        else if (buildTaskList[0].taskType == BuildTaskType.DESTROY) {
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
    public doneBuildTasks: BuildTask[] = [];
    public failedToShelude: BuildTask[] = [];
}

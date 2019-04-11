import Planet from "@db/models/planet";
import BuildTask, { BuildTaskType } from "@db/models/build-task";
import BuildCalculator from "../building/build-calculator";
import { haveEnoughResources, subtractResources } from "../../utils";
import BuildQueue from "../building/build-queue";
import Player from "@db/models/player";
import ResearchQueue from "../research/research-queue";
import ResearchTask from "@db/models/research-task";
import ResearchCalculator from "../research/research-calculator";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

/**
 * This is Pure Updater, hell ye.
 * I called it "pure" because it's not changing ANYTHING in database, it just changing numbers in memory
 * Thanks this I can better control database access
 */
export class PureUpdater {
    /** Returns current updater time, useful when updater pauses, because of research task on other planet */
    public get currentUpdaterTime() {
        return this._currentUpdaterTime;
    }
    public failedBuildTasks: BuildTask[] = [];
    public failedResearchTasks: ResearchTask[] = [];
    public finished: boolean;
    private targetTime: number;
    private _currentUpdaterTime: number;
    public constructor(
        private readonly player: Player,
        private readonly planet: Planet,
        private readonly buildQueue: BuildQueue,
        private readonly researchQueue: ResearchQueue) { }

    public init(targetTime = Date.now()) {
        this.targetTime = targetTime;
        this._currentUpdaterTime = this.planet.lastUpdate.getTime();
        this.finished = false;
    }

    /**
     * Starts updating planet and player. If update is done it will return true; otherwise it will return false
     */
    public startUpdate() {
        const timeSinceLastUpdate = this.targetTime - this._currentUpdaterTime;
        if (timeSinceLastUpdate <= 0)
            return;

        /** There's no buildings and research in queue, so we can update only resources */
        if (this.buildQueue.length() === 0 && this.researchQueue.length() === 0) {
            const hoursSinceLastUpdate = timeSinceLastUpdate / HOUR;
            this.updateResources(hoursSinceLastUpdate);
            this.planet.lastUpdate = new Date(this.targetTime);
            this.finished = true;
            return true;
        }

        this.updateTick(this.planet.lastUpdate.getTime());

        if(this.finished) {
            this.planet.lastUpdate = new Date(this.targetTime);
            return true;
        }
        return false;
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
    private updateTick(startTime: number): void {
        this.planet.calculateEconomy(); //Recalculate economy details

        let endTime = this.targetTime;
        if (this.areAnyTasksInQueueToDo() === false) {
            const deltaHours = (endTime - startTime) / HOUR;
            this.updateResources(deltaHours);
            this.finished = true;
            return;
        }

        const nextTaskType = this.getNextTaskType();
        if(nextTaskType === "BUILD") {
            endTime = this.buildQueue.front().finishTime.getTime();
            const deltaHours = (endTime - startTime) / HOUR;
            this.updateResources(deltaHours);
            this.updateBuilding(this.buildQueue.front());
            this.buildQueue.pop();
            this.setNextBuildTaskOnTop(endTime);
        }
        if(nextTaskType === "RESEARCH") {
            endTime = this.researchQueue.front().finishTime.getTime();
            const deltaHours = (endTime - startTime) / HOUR;
            this.updateResources(deltaHours);
            this.updateResearch(this.researchQueue.front());
            this.researchQueue.pop();
            const succeed = this.setNextResearchTaskOnTop(endTime);
            if(!succeed) {
                this._currentUpdaterTime = endTime;
                return;
            }
        }
        return this.updateTick(endTime);
    }
    private areAnyTasksInQueueToDo(): boolean {
        const buildingsToBuild = this.buildQueue.length() > 0 && this.buildQueue.front().finishTime.getTime() <= this.targetTime;
        const researchToDo = this.researchQueue.length() > 0 && this.researchQueue.front().finishTime.getTime() <= this.targetTime;
        return buildingsToBuild || researchToDo;
    }
    private getNextTaskType(): string {
        if(this.researchQueue.length() === 0) return "BUILD";
        if(this.buildQueue.length() === 0) return "RESEARCH";
        const researchFinishTime = this.researchQueue.front().finishTime.getTime();
        const buildingFinishTime = this.buildQueue.front().finishTime.getTime();
        return (buildingFinishTime <= researchFinishTime) ? "BUILD" : "RESEARCH";
    }
    private updateBuilding(buildTask: BuildTask) {
        if (buildTask.taskType == BuildTaskType.BUILD) {
            this.planet.buildings[buildTask.buildingName]++;
        }
        else if (buildTask.taskType == BuildTaskType.DESTROY) {
            this.planet.buildings[buildTask.buildingName]--;
        }
    }
    private updateResearch(researchTask: ResearchTask) {
        this.player.research[researchTask.researchName]++;
    }
    private setNextBuildTaskOnTop(startTime: number) {
        if (this.buildQueue.length() === 0)
            return;
        if (this.buildQueue.front().taskType == BuildTaskType.BUILD) {
            const buildingName = this.buildQueue.front().buildingName;
            const calculator = new BuildCalculator(this.planet);
            const buildingLevel = this.planet.buildings[buildingName];
            const cost = calculator.calculateCostForBuild(buildingName, buildingLevel);
            if (!haveEnoughResources(this.planet, cost)) {
                this.failedBuildTasks.push(this.buildQueue.pop());
                if(this.buildQueue.length() > 0) {
                    //It has to update next build task, because this one failed
                    this.buildQueue.front().startTime = new Date(startTime);
                    this.setNextBuildTaskOnTop(startTime);
                }
                return;
            }
            const buildTime = calculator.calculateBuildTime(cost, buildingLevel);

            this.buildQueue.front().startTime = new Date(startTime);
            this.buildQueue.front().finishTime = new Date(startTime + buildTime);
            subtractResources(this.planet, cost);
            return;
        }
        else if (this.buildQueue.front().taskType == BuildTaskType.DESTROY) {
            throw new Error("Not implemented");
        }
    }
    /** Returns true if there was no problem or false if couldn't do it on currently updating planet */
    private setNextResearchTaskOnTop(startTime: number) {
        if(this.researchQueue.length() === 0)
            return true;
        const nextTask = this.researchQueue.front();
        //Return false, I can't do it on this planet, pure updater have to pause itself and wait for normal updater to solve this problem. Fuck this updaters.
        if(nextTask.planetId != this.planet.id)
            return false;
        //I can do it on this planet YAYX <3
        const reseachName = nextTask.researchName;
        const calculator = new ResearchCalculator(this.planet);
        const researchLevel = this.player.research[reseachName];
        const cost = calculator.calculateResearchCost(reseachName, researchLevel);
        if(!haveEnoughResources(this.planet, cost)) {
            this.failedResearchTasks.push(this.researchQueue.pop());
            if(this.researchQueue.length() > 0) {
                //It has to update next research task, because this one failed
                this.researchQueue.front().startTime = new Date(startTime);
                this.setNextResearchTaskOnTop(startTime);
            }
        }
        const researchTime = calculator.calculateResearchTime(cost);
        nextTask.startTime = new Date(startTime);
        nextTask.finishTime = new Date(startTime + researchTime);
        subtractResources(this.planet, cost);
        return true;
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
}

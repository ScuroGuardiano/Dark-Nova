import Planet from "../../../db/models/planet";
import BuildTask from "../../../db/models/build-task";
import uniConfig from "../../../config/uni-config";
import { EntityManager, getManager } from "typeorm";

/**
 * Abstraction for BuildTask table.  
 * It's in fact priority queue, front element is element with the least finish time, last with the highest.
 */
export default class BuildQueue {
    constructor(private planet: Planet, private premium: boolean = false) {
        this.entityManager = getManager();
    }
    /** Overrides default entity manager. Useful in transactions <3 */
    public useEntityManager(entityManager: EntityManager) {
        this.entityManager = entityManager;
    }
    /** Overrides current entity manager with default. */
    public useDefaultEntityManager() {
        this.entityManager = getManager();
    }
    public front() {
        return this.entityManager.findOne(BuildTask, {
            where: { planetId: this.planet.id },
            order: { finishTime: "ASC" }
        });
    }
    public back() {
        return this.entityManager.findOne(BuildTask, {
            where: { planetId: this.planet.id },
            order: { finishTime: "DESC" }
        });
    }
    public async isEmpty() {
        return (await this.entityManager.count(BuildTask, { planetId: this.planet.id })) === 0;
    }
    public async isFull() {
        //@ts-ignore
        let maxSize = uniConfig.get('buildQueueLimit')[this.premium ? 'premium' : 'normal'];
        return (await this.entityManager.count(BuildTask, { planetId: this.planet.id })) === maxSize;
    }
    public countElementsForBuilding(buildingName: string) {
        return this.entityManager.count(BuildTask, { 
            planetId: this.planet.id,
            buildingName: buildingName
        });
    }
    public toArray() {
        return this.entityManager.find(BuildTask, {
            where: { planetId: this.planet.id },
            order: { finishTime: "ASC" }
        });
    }
    /** Adds new element into queue, doesn't check if it's exceed queue size */
    public push(buildTask: BuildTask) {
        this.entityManager.save(buildTask);
    }
    /** Removes and returns first element in the queue */
    public async pop() {
        let task = await this.front();
        await this.entityManager.remove(task);
        return task;
    }
    public async removeTasks(tasks: BuildTask[]) {
        await this.entityManager.remove(tasks);
    }
    public async updateTasks(tasks: BuildTask[]) {
        await this.entityManager.save(tasks);
    }
    private entityManager: EntityManager;
}

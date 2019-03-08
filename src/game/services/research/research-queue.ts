import Player from "../../../db/models/player";
import { EntityManager, getManager } from "typeorm";
import ResearchTask from "../../../db/models/research-task";

export default class ResearchQueue {
    constructor(private player: Player, private premium: boolean = false) {
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
        return this.entityManager.findOne(ResearchTask, {
            where: { playerId: this.player.id },
            order: { finishTime: "ASC" }
        });
    }
    public back() {
        return this.entityManager.findOne(ResearchTask, {
            where: { playerId: this.player.id },
            order: { finishTime: "DESC" }
        });
    }
    public async isEmpty() {
        return (await this.entityManager.count(ResearchTask, { playerId: this.player.id })) === 0;
    }
    public async isFull() {
        //@ts-ignore
        let maxSize = uniConfig.get('researchQueueLimit')[this.premium ? 'premium' : 'normal'];
        return (await this.entityManager.count(ResearchTask, { playerId: this.player.id })) === maxSize;
    }
    public async length() {
        return await this.entityManager.count(ResearchTask, { playerId: this.player.id });
    }
    public countElementsForBuilding(researchName: string) {
        return this.entityManager.count(ResearchTask, { 
            playerId: this.player.id,
            researchName: researchName
        });
    }
    public toArray() {
        return this.entityManager.find(ResearchTask, {
            where: { playerId: this.player.id },
            order: { finishTime: "ASC" }
        });
    }
    /** Adds new element into queue, doesn't check if it's exceed queue size */
    public push(ResearchTask: ResearchTask) {
        this.entityManager.save(ResearchTask);
    }
    /** Removes and returns first element in the queue */
    public async pop() {
        let task = await this.front();
        await this.entityManager.remove(task);
        return task;
    }
    public async removeTasks(tasks: ResearchTask[]) {
        await this.entityManager.remove(tasks);
    }
    public async updateTasks(tasks: ResearchTask[]) {
        await this.entityManager.save(tasks);
    }
    private entityManager: EntityManager;
}

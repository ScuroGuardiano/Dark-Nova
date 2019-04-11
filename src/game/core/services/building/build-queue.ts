import Planet from "@db/models/planet";
import BuildTask from "@db/models/build-task";
import uniConfig from "@config/uni-config";
import { EntityManager, getManager } from "typeorm";
import BaseTaskQueue from "../../../data-types/base-task-queue";

/**
 * Abstraction for BuildTask table.
 * It's in fact priority queue, front element is element with the least finish time, last with the highest.
 */
export default class BuildQueue extends BaseTaskQueue<BuildTask> {
    constructor(private readonly planet: Planet, private readonly premium = false) {
        super();
        this.maxSize = uniConfig.get('buildQueueLimit')[this.premium ? 'premium' : 'normal'];
    }
    public async load(entityManager: EntityManager = getManager()): Promise<BuildQueue> {
        this.elements = await entityManager.find(BuildTask, {
            where: { planetId: this.planet.id },
            order: { finishTime: "ASC" }
        });
        return this;
    }
    public async save(entityManager: EntityManager): Promise<BuildQueue> {
        await Promise.all([
            entityManager.remove(this.removed),
            entityManager.save(this.elements)
        ]);
        return this;
    }
    public countElementsForBuilding(buildingName: string) {
        return this.elements.reduce((count, current): number => {
            if(current.buildingName === buildingName)
                return count + 1;
            return count;
        }, 0);
    }
}

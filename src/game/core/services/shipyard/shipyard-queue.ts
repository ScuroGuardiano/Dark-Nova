import BaseTaskQueue from "../../../data-types/base-task-queue";
import ShipyardTask from "@db/models/shipyard-task";
import Planet from "@db/models/planet";
import uniConfig from "@config/uni-config";
import { getManager, EntityManager } from "typeorm";

export default class ShipyardQueue extends BaseTaskQueue<ShipyardTask> {
    constructor(private readonly planet: Planet, private readonly premium = false) {
        super();
        this.maxSize = uniConfig.get('shipyardQueueLimit')[this.premium ? 'premium' : 'normal'];
    }
    public async load(entityManager = getManager()): Promise<ShipyardQueue> {
        this.elements = await entityManager.find(ShipyardTask, {
            where: { planetId: this.planet.id },
            order: { finishTime: "ASC" }
        });
        return this;
    }
    public async save(entityManager: EntityManager): Promise<ShipyardQueue> {
        await Promise.all([
            entityManager.remove(this.removed),
            entityManager.save(this.elements)
        ]);
        return this;
    }
    public countElementsForStructureName(structureName: string) {
        return this.elements.reduce((count, current): number => {
            if (current.structureName === structureName)
                return count + 1;
            return count;
        }, 0);
    }
}

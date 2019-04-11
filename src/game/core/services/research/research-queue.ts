import Player from "../../../../db/models/player";
import { EntityManager, getManager } from "typeorm";
import ResearchTask from "../../../../db/models/research-task";
import BaseTaskQueue from "../../../data-types/base-task-queue";
import uniConfig from "../../../../config/uni-config";

export default class ResearchQueue extends BaseTaskQueue<ResearchTask> {
    constructor(private readonly player: Player, private readonly premium = false) {
        super();
        this.maxSize = uniConfig.get('researchQueueLimit')[this.premium ? 'premium' : 'normal'];
    }
    public async load(entityManager: EntityManager = getManager()): Promise<ResearchQueue> {
        this.elements = await entityManager.find(ResearchTask, {
            where: { playerId: this.player.id },
            order: { finishTime: "ASC" }
        });
        return this;
    }
    public async save(entityManager: EntityManager): Promise<ResearchQueue> {
        await Promise.all([
            entityManager.remove(this.removed),
            entityManager.save(this.elements)
        ]);
        return this;
    }
    public countElementsForResearchName(researchName: string): number {
        return this.elements.reduce((count, current): number => {
            if (current.researchName === researchName)
                return count + 1;
            return count;
        }, 0);
    }
}

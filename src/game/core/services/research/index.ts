import ResearchCalculator from "./research-calculator";
import ResearchSheluder from "./research-sheluder";
import Planet from "@db/models/planet";
import Player from "@db/models/player";
import ResearchQueue from "./research-queue";

export default class ResearchService {
    private calculator: ResearchCalculator;
    private sheluder: ResearchSheluder;

    public get $calculator() {
        return this.calculator ? this.calculator : this.calculator = new ResearchCalculator(this.planet);
    }
    public get $sheluder() {
        return this.sheluder ? this.sheluder : this.sheluder = new ResearchSheluder(this.player, this.planet);
    }
    constructor(private readonly player: Player, private readonly planet: Planet) {}
    public async getResearchQueue(): Promise<ResearchQueue> {
        const queue = new ResearchQueue(this.player /*TODO: premium*/);
        return queue.load();
    }
}

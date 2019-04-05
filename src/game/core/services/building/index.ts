import Planet from "../../../../db/models/planet";
import Player from "../../../../db/models/player";
import BuildQueue from "./build-queue";
import BuildCalculator from "./build-calculator";
import BuildSheluder from "../../../services/buildings/build-sheluder";

export default class BuildingService {
    private calculator: BuildCalculator;
    private sheluder: BuildSheluder;
    public get $calculator() {
        return this.calculator ? this.calculator : this.calculator = new BuildCalculator(this.planet);
    }
    public get $sheluder() {
        return this.sheluder ? this.sheluder : this.sheluder = new BuildSheluder(this.planet);
    }
    constructor(private planet: Planet) {}
    public async getBuildQueue(): Promise<BuildQueue> {
        const buildQueue = new BuildQueue(this.planet /*TODO: premium*/);
        await buildQueue.load();
        return buildQueue;
    }
}


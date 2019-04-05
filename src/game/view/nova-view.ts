import NovaCore from "../core/nova-core";
import IOverviewPage from "./interfaces/pages/overview";
import IBuildingsPage from "./interfaces/pages/buildings";
import IBuildingInfo from "./interfaces/buildings-info";
import { getBuidingNameByKey } from "../utils";

export default class NovaView {
    constructor(private readonly core: NovaCore) {}
    public overview(): IOverviewPage {
        return {
            planet: this.core.$planet,
            player: this.core.$player
        }
    }
    public async buildings(): Promise<IBuildingsPage> {
        const buildingsInfo: IBuildingInfo[] = [];
        const calculator = this.core.building.$calculator;
        this.core.$planet.buildings.getBuildingsList().forEach(building => {
            const cost = calculator.calculateCostForBuild(building.key, building.level);
            const buildTime = calculator.calculateBuildTime(cost, building.level);
            buildingsInfo.push({
                key: building.key,
                level: building.level,
                name: getBuidingNameByKey(building.key),
                cost: cost,
                buildTime: buildTime
            });
        });
        const buildQueue = await this.core.building.getBuildQueue();
        return {
            planet: this.core.$planet,
            player: this.core.$player,
            buildings: buildingsInfo,
            buildQueue: buildQueue.toArray()
        };
    }
}


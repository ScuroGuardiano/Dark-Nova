import NovaCore from "@core/nova-core";
import IOverviewPage from "./interfaces/pages/overview";
import IBuildingsPage from "./interfaces/pages/buildings";
import IBuildingInfo from "./interfaces/buildings-info";
import { getBuidingNameByKey, getTechNameByKey } from "./utils";
import IResearchInfo from "./interfaces/research-info";
import IResearchPage from "./interfaces/pages/research";

export default class NovaView {
    constructor(private readonly core: NovaCore) {}
    public overview(): IOverviewPage {
        return {
            planet: this.core.$planet,
            player: this.core.$player
        };
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
    public async research(): Promise<IResearchPage> {
        const technologies: IResearchInfo[] = [];
        const calculator = this.core.researching.$calculator;
        this.core.$player.research.getResearchList().forEach(technology => {
            const cost = calculator.calculateResearchCost(technology.key, technology.level);
            const researchTime = calculator.calculateResearchTime(cost);
            technologies.push({
                key: technology.key,
                level: technology.level,
                name: getTechNameByKey(technology.key),
                cost: cost,
                researchTime: researchTime
            });
        });
        const researchQueue = await this.core.researching.getResearchQueue();
        return {
            planet: this.core.$planet,
            player: this.core.$player,
            technologies: technologies,
            researchQueue: researchQueue.toArray()
        };
    }
}

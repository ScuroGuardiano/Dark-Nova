import Planet from "../../../db/models/planet";
import { IResourcesAndEnergy, ResourcesAndEnergy, IResources } from "../../data-types/resources";
import uniConfig from "../../../config/uni-config";

//https://ogame.fandom.com/wiki/Buildings
export default class BuildingsCalculator {
    constructor(private readonly planet: Planet) {}
    public calculateCostForBuild(buildingName: string, currentBuildingLevel: number) {
        return this.getCalculateCostFunctionForBuilding(buildingName)(currentBuildingLevel);
    }
    /**
     * Returns build time in milliseconds rounded down
     * @param buildCost cost for build building :p
     * @param level current building's level
     */
    public calculateBuildTime(buildCost: IResources, level: number) {
        const robotFactory = this.planet.buildings.robotFactory;
        const nanoFactory = this.planet.buildings.nanoFactory;
        const universeBuildSpeed = uniConfig.get('speed').buildings;

        let timeInHours = (buildCost.metal + buildCost.deuter) / (2500 * (1 + robotFactory) * Math.pow(2, nanoFactory) * universeBuildSpeed);
        if(level < 5)
            timeInHours *= 2 / (7 - level);
        return Math.floor(timeInHours * 60 * 60 * 1000);
    }
    private getCalculateCostFunctionForBuilding(buildingName: string): (level: number) => IResourcesAndEnergy {
        switch(buildingName) {
            case "metalMine":
                return (level: number) =>
                    new ResourcesAndEnergy(60, 15)
                    .multiplyBy(Math.pow(1.5, level))
                    .floor();
            case "crystalMine":
                return (level: number) =>
                    new ResourcesAndEnergy(48, 24)
                    .multiplyBy(Math.pow(1.6, level))
                    .floor();
            case "deuteriumSynthesizer":
                return (level: number) =>
                    new ResourcesAndEnergy(225, 75)
                    .multiplyBy(Math.pow(1.5, level))
                    .floor();
            case "solarPlant":
                return (level: number) =>
                    new ResourcesAndEnergy(75, 30)
                    .multiplyBy(Math.pow(1.5, level))
                    .floor();
            case "fusionReactor":
                return (level: number) =>
                    new ResourcesAndEnergy(900, 360, 180)
                    .multiplyBy(Math.pow(1.8, level))
                    .floor();
            case "metalStorage":
                return (level: number) =>
                    new ResourcesAndEnergy(1000)
                    .multiplyBy(Math.pow(2, level))
                    .floor();
            case "crystalStorage":
                return (level: number) =>
                    new ResourcesAndEnergy(1000, 500)
                    .multiplyBy(Math.pow(2, level))
                    .floor();
            case "deuteriumStorage":
                return (level: number) =>
                    new ResourcesAndEnergy(1000, 1000)
                    .multiplyBy(Math.pow(2, level))
                    .floor();
            case "robotFactory":
                return (level: number) =>
                    new ResourcesAndEnergy(400, 120, 200)
                    .multiplyBy(Math.pow(2, level))
                    .floor();
            case "nanoFactory":
                return (level: number) =>
                    new ResourcesAndEnergy(1000000, 500000, 100000)
                    .multiplyBy(Math.pow(2, level))
                    .floor();
            case "shipyard":
                return (level: number) =>
                    new ResourcesAndEnergy(400, 200, 100)
                    .multiplyBy(Math.pow(2, level))
                    .floor();
            case "laboratory":
                return (level: number) =>
                    new ResourcesAndEnergy(200, 400, 200)
                    .multiplyBy(Math.pow(2, level))
                    .floor();
            case "missileSilo":
                return (level: number) =>
                    new ResourcesAndEnergy(20000, 20000, 1000)
                    .multiplyBy(Math.pow(2, level))
                    .floor();
            case "terraformer":
                return (level: number) =>
                    new ResourcesAndEnergy(0, 50000, 100000, 1000)
                    .multiplyBy(Math.pow(2, level))
                    .floor();
            case "allianceDepot":
                return (level: number) =>
                    new ResourcesAndEnergy(20000, 40000)
                    .multiplyBy(Math.pow(2, level))
                    .floor();
            case "spaceDock":
                return (level: number) =>
                    new ResourcesAndEnergy(
                        200 * Math.pow(5, level),
                        0,
                        50 * Math.pow(5, level),
                        50 * Math.pow(2.5, level)
                    )
                    .floor();
            default:
                throw new Error(`There's no cost function for building ${buildingName}!`);
        }
    }
}

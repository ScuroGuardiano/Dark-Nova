import Player from "../../../db/models/player";
import Planet from "../../../db/models/planet";
import { ResourcesAndEnergy, IResources } from "../../data-types/resources";
import uniConfig from "../../../config/uni-config";

export default class ResearchCalculator {
    constructor(private readonly planet: Planet) {}
    public canDoResearch() {
        return this.planet.buildings.laboratory > 0;
    }
    public calculateResearchCost(techName: string, currentLevel: number) {
        return this.getResearchCostFunction(techName)(currentLevel);
    }
    public calculateResearchTime(cost: IResources) {
        const universeResearchSpeed = uniConfig.get('speed').research;
        const labLevel = this.planet.buildings.laboratory;
        const timeInHours = (cost.metal + cost.crystal) / (universeResearchSpeed * 1000 * (1 + labLevel));
        return Math.floor(timeInHours * 60 * 60 * 1000);
    }
    private getResearchCostFunction(techName: string) {
        switch(techName) {
            case "energyTechnology":
                return (level: number) =>
                    new ResourcesAndEnergy(0, 800, 400)
                    .multiplyBy(Math.pow(2, level));
            case "laserTechnology":
                return (level: number) =>
                    new ResourcesAndEnergy(200, 100)
                    .multiplyBy(Math.pow(2, level));
            case "ionTechnology":
                return (level: number) =>
                    new ResourcesAndEnergy(1000, 300, 100)
                    .multiplyBy(Math.pow(2, level));
            case "hyperspaceTechnology":
                return (level: number) =>
                    new ResourcesAndEnergy(0, 4000, 2000)
                    .multiplyBy(Math.pow(2, level));
            case "plasmaTechnology":
                return (level: number) =>
                    new ResourcesAndEnergy(2000, 4000, 1000)
                    .multiplyBy(Math.pow(2, level));
            case "espionageTechnology":
                return (level: number) =>
                    new ResourcesAndEnergy(200, 1000, 200)
                    .multiplyBy(Math.pow(2, level));
            case "computerTechnology":
                return (level: number) =>
                    new ResourcesAndEnergy(0, 400, 600)
                    .multiplyBy(Math.pow(2, level));
            case "astrophysics":
                return (level: number) =>
                    new ResourcesAndEnergy(40, 80, 40)
                    .multiplyBy(Math.pow(1.75, level))
                    .round()
                    .multiplyBy(100);
            case "network":
                return (level: number) =>
                    new ResourcesAndEnergy(240000, 400000, 160000)
                    .multiplyBy(Math.pow(2, level));
            case "gravitonTechnology":
                return (level: number) =>
                    new ResourcesAndEnergy(0, 0, 0, 300000)
                    .multiplyBy(Math.pow(3, level));
            case "combustionDrive":
                return (level: number) =>
                    new ResourcesAndEnergy(400, 0, 600)
                    .multiplyBy(Math.pow(2, level));
            case "impulseDrive":
                return (level: number) =>
                    new ResourcesAndEnergy(2000, 4000, 600)
                    .multiplyBy(Math.pow(2, level));
            case "hyperspaceDrive":
                return (level: number) =>
                    new ResourcesAndEnergy(10000, 20000, 6000)
                    .multiplyBy(Math.pow(2, level));
            case "weaponTechnology":
                return (level: number) =>
                    new ResourcesAndEnergy(800, 200)
                    .multiplyBy(Math.pow(2, level));
            case "shieldingTechnology":
                return (level: number) =>
                    new ResourcesAndEnergy(200, 600)
                    .multiplyBy(Math.pow(2, level));
            case "armourTechnology":
                return (level: number) =>
                    new ResourcesAndEnergy(1000)
                    .multiplyBy(Math.pow(2, level));
            default:
                throw new Error("There's no cost function for tech: " + techName);
        }
    }
}

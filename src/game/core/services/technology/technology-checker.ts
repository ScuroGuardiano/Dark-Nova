import PlanetBuildings from "@db/models/planet-buildings";
import Research from "@db/models/research";
import * as requirements from './requirements';
import { IRequirement } from "./i-requirement";

export default class TechnologyChecker {
    constructor(private readonly buildings: PlanetBuildings, private readonly technologies: Research) {}
    public checkForBuilding(buildingName: string) {
        const requirementList = requirements.buildings[buildingName];
        if(!requirementList)
            return true; //No requirements for building
        let meetsRequirements = true;
        meetsRequirements = this.checkBuildings(requirementList, meetsRequirements);
        meetsRequirements = this.checkTechnologies(requirementList, meetsRequirements);
        return meetsRequirements;
    }
    public checkForResearch(technologyName: string) {
        const requirementList = requirements.technologies[technologyName];
        if(!requirementList)
            return true;
        let meetsRequirements = true;
        meetsRequirements = this.checkBuildings(requirementList, meetsRequirements);
        meetsRequirements = this.checkTechnologies(requirementList, meetsRequirements);
        return meetsRequirements;
    }
    private checkTechnologies(requirementList: IRequirement, meetsRequirements: boolean) {
        if (meetsRequirements && requirementList.research) {
            Object.keys(requirementList.research).forEach(requirement => {
                if (this.technologies[requirement] < requirementList.research[requirement]) {
                    meetsRequirements = false;
                }
            });
        }
        return meetsRequirements;
    }

    private checkBuildings(requirementList: IRequirement, meetsRequirements: boolean) {
        if (requirementList.buildings) {
            Object.keys(requirementList.buildings).forEach(requirement => {
                if (this.buildings[requirement] < requirementList.buildings[requirement]) {
                    meetsRequirements = false;
                }
            });
        }
        return meetsRequirements;
    }
}
import { IResourcesAndEnergy } from "../../data-types/resources";

export default interface IResearchInfo {
    key: string;
    name: string;
    level: number;
    cost: IResourcesAndEnergy;
    researchTime: number;
}

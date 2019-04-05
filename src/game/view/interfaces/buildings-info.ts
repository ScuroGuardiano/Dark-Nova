import { IResourcesAndEnergy } from "../../data-types/resources";

export default interface IBuildingInfo { 
    key: string;
    name: string;
    level: number;
    cost: IResourcesAndEnergy;
    buildTime: number;
}

import { IResourcesAndEnergy } from "./resources";

export default interface IBuildingInfo {
    key: string;
    level: number;
    cost: IResourcesAndEnergy;
    buildTime: number;
}

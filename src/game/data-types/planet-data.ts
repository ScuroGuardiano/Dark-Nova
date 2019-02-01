import { ICoordinates } from "./coordinates";
import { IResources } from "./resources";
import { ITemperature } from "./temperature";

export default interface IPlanetData {
    name: string;
    coords: ICoordinates;
    resources?: IResources;
    diameter: number;
    maxFields: number;
    temperature: ITemperature;
    planetType: string;
}

import { IResources } from "../../../data-types/resources";
import Planet from "@db/models/planet";
import uniConfig from "@config/uni-config";

export default function calculateShipyardTaskBuildTime(cost: IResources, planet: Planet) {
    const time = 
        (
            cost.metal + 
            cost.crystal
        ) / (
            2500 * 
            (uniConfig.get('speed').shipyard) * 
            (1 + planet.buildings.shipyard) * 
            Math.pow(2, planet.buildings.nanoFactory)
        );
    return time;
}
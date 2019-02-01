import { ICoordinates } from "../data-types/coordinates";
import { IResources } from "../data-types/resources";
import HomePlanetService from "./home-planet";
import IPlanetData from "../data-types/planet-data";
import uniConfig from "../../config/uni-config";
import * as _ from 'lodash';
import Planet from "../../db/models/planet";

export default class PlanetService {
    public constructor(homePlanetService?: HomePlanetService) {
        if(homePlanetService instanceof HomePlanetService)
            this.homePlanetService = homePlanetService;
        else
            this.homePlanetService = new HomePlanetService();
    }
    /**
     * 
     * @param playerId Id of player who planet belongs to
     * @param coords Coordinates of da planet, if home is set to true set here null or whatever it will be ignored anyway
     * @param home false - colony, true - home planet, if it is set to true it ignores coords param
     * @param resources Resources at start, if making colony it should be transported resources from fleet, if making home it shouldn't be set
     */
    //TODO: I don't know if it will work, need to test it
    public async createNewPlanet(playerId: number, coords: ICoordinates, home: boolean = false, resources?: IResources) {
        let planetData = await this.generatePlanetData(coords, home, resources || null);
        let planet = Planet.createPlanet(playerId, planetData as IPlanetData);
        return await planet.save();
    }
    //TODO: I don't know if it will work, need to test it
    private async generatePlanetData(coords: ICoordinates, home: boolean, resources: IResources) {
        let planetData: Partial<IPlanetData>;
        if (home === true) {
            planetData = await this.homePlanetService.generatePlanetDataForHomePlanet();
            planetData.name = "Home Planet";
        }
        else {
            planetData = {};
            planetData.name = "Colony";
            planetData.coords = coords;
            const planetConfig = this.planetsConfig[coords.position.toString()];
            //TODO: Change it to gaussian random
            planetData.maxFields = _.random(planetConfig.size.min, planetConfig.size.max);
            planetData.diameter = Math.floor(Math.sqrt(planetData.maxFields) * 1000);
        }
        const planetConfig = this.planetsConfig[coords.position.toString()];
        //TODO: Need to change temperature generation from static to random, values min and max should be random, I need to investigate how OGame generates temperatures exactly
        planetData.temperature = { 
            min: planetConfig.temperature.min,
            max: planetConfig.temperature.max 
        };

        if (planetData.coords.system % 2 === 1) {
            planetData.planetType = planetConfig.type.systemNumberOdd;
        }
        else {
            planetData.planetType = planetConfig.type.systemNumberEven;
        }
        
        if(resources) {
            planetData.resources = resources;
        }

        return planetData;
    }
    private homePlanetService: HomePlanetService;
    private planetsConfig: any = uniConfig.get("planets"); //F*ck this types, it getting bugged with convict and indexes
}
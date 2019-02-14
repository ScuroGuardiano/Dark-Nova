import { ICoordinates } from "../data-types/coordinates";
import { IResources } from "../data-types/resources";
import HomePlanetService from "./home-planet";
import IPlanetData from "../data-types/planet-data";
import uniConfig from "../../config/uni-config";
import * as _ from 'lodash';
import Planet from "../../db/models/planet";
import BasicError from "../../errors/basic-error";
import logger from "../../logger";

export namespace Errors {
    export class InvalidCoordinates extends BasicError {
        constructor(coords: ICoordinates) {
            super(`Coordinates ${coords.galaxy}:${coords.system}:${coords.position} are invalid!`);
        }
    }
    export class PositionIsTaken extends BasicError {
        constructor(coords: ICoordinates) {
            super(`There is already planet on coords: ${coords.galaxy}:${coords.system}:${coords.position}!`);
        }
    }
}

export default class PlanetService {
    public constructor(private homePlanetService: HomePlanetService = new HomePlanetService()) {}
    /**
     * Creates and saves new planet to database
     * @param playerId Id of player who planet belongs to
     * @param coords Coordinates of da planet, if home is set to true set here null or whatever it will be ignored anyway
     * @param home false - colony, true - home planet, if it is set to true it ignores coords param
     * @param resources Resources at start, if making colony it should be transported resources from fleet, if making home it shouldn't be set
     */
    //TODO: I don't know if it will work, need to test it
    public async createNewPlanet(playerId: number, coords: ICoordinates, home: boolean = false, resources?: IResources) {
        if(home === false && this.checkCoords(coords) === false) {
            logger.error(`Coordinates ${coords.galaxy}:${coords.system}:${coords.position} are invalid!`);
            throw new Errors.InvalidCoordinates(coords);
        }
        let planetData = await this.generatePlanetData(coords, home, resources || null);
        
        //Check after generating planet data to make sure that HomePlanetService bug didn't generate wrong coords
        if(await this.isPositionFree(planetData.coords) === false) {
            logger.error(`There's already planet on coords: ${planetData.coords.galaxy}:${planetData.coords.system}:${planetData.coords.position}!`)
            throw new Errors.PositionIsTaken(planetData.coords);
        }
        let planet = Planet.createPlanet(playerId, planetData as IPlanetData);
        await planet.save();
        logger.info(`Created new ${home ? "home " : ""}planet on coords ${planet.galaxy}:${planet.system}:${planet.position}.`);
        return planet;
    }
    public getPlanetById(id: number | string): Promise<Planet> {
        return Planet.findOne(id);
    }
    public getFirstPlanetForPlayerId(playerId: number | string): Promise<Planet> {
        return Planet.findOne({ playerId: playerId as any });
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
        const planetConfig = this.planetsConfig[planetData.coords.position.toString()];
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
    private checkCoords(coords: ICoordinates) {
        return _.inRange(coords.galaxy, 1, uniConfig.get('size').galaxies + 1) &&
            _.inRange(coords.system, 1, uniConfig.get('size').systems + 1) &&
            _.inRange(coords.position, 1, uniConfig.get('size').planets + 1)
    }
    private async isPositionFree(coords: ICoordinates) {
        let planetExists = await Planet.isPlanetExistsByCoords(coords.galaxy, coords.system, coords.position);
        return !planetExists;
    }
    private planetsConfig: any = uniConfig.get("planets"); //F*ck this types, it getting bugged with convict and indexes
}

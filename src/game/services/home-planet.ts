import uniConfig from "../../config/uni-config";
import Planet from "../../db/models/planet";
import * as _ from 'lodash';
import logger from "../../logger";
import { getRepository, Between } from "typeorm";
import IPlanetData from "../data-types/planet-data";
import BasicError from "../../errors/basic-error";
import { Coordinates } from "../data-types/coordinates";
import { Resources } from "../data-types/resources";

export namespace Errors {
    export class NoAvailableSystemsForHomePlanet extends BasicError {
        constructor() {
            super("There's no more available space (hehe) in The Universe for home planets!");
        }
    }
}

//TODO: Test in on production don't waste time for testing now ;)
/**
 * This class contains whole logic for fiding home planets
 * And home planets distribution in space
 * Unfortunately it will get complicated as f*ck, because I will write a lot of rules here
 */
export default class HomePlanetService {
    //TODO: Write auto tests for it
    /**
     * Generates all home planet specific data, rest is up to Planet Service as for example temperature.
     */
    public async generatePlanetDataForHomePlanet(): Promise<Partial<IPlanetData>> {
        let coords = await this.generateCoordinatesForHomePlanet();
        logger.debug(`Generated coords for new home planet: ${coords.toString()}`);
        let resources = new Resources(
            this.homePlanetConfig.startingResources.metal,
            this.homePlanetConfig.startingResources.crystal,
            this.homePlanetConfig.startingResources.deuter
        );
        let maxFields = this.homePlanetConfig.fields.max;
        if(this.homePlanetConfig.fields.max !== this.homePlanetConfig.fields.min) {
            //TODO: Change it to gaussian random
            maxFields = _.random(this.homePlanetConfig.fields.min, this.homePlanetConfig.fields.max);
        }
        let diameter = this.homePlanetConfig.diameter;

        return {
            coords: coords,
            resources: resources,
            maxFields: maxFields,
            diameter: diameter
        };
    }
    /**
     * _**IMPORTANT**_:  
     * _**This is one of the key functions that is responsible for planet distribution in universe!**_  
     *   
     * Generating coords for home planet, currently it's chosing it totally random  
     * Maybe later I will do something more fancy, but for now it will be enough.
     */
    private async generateCoordinatesForHomePlanet(): Promise<Coordinates> {
        let availableSystems = await this.findAvailableSystemsForHomePlanets();
        if(availableSystems.length === 0) {
            logger.error("There's no more available space (hehe) in The Universe for home planets! The Universe is almost full!");
            throw new Errors.NoAvailableSystemsForHomePlanet();
        }
        let galaxyIndex = _.random(0, availableSystems.length - 1); //Take random available galaxy INDEX;
        let system = _.sample(availableSystems[galaxyIndex].systems) //Take random system from galaxy;
        let galaxy = availableSystems[galaxyIndex].galaxy;
        let positions = await this.findAvailableHomePlanetPositionsForSystem(galaxy, system);
        let position = _.sample(positions);

        return new Coordinates(galaxy, system, position);
    }
    /** 
     * Returns available systems for home planets in format: 
     * { galaxy: galaxyNumber, systems: availableSystems[] }[]
    */
    private async findAvailableSystemsForHomePlanets() {
        const reservedSystems = uniConfig.get('reservedSystems');
        const universeSize = uniConfig.get('size');

        let planetsInSystems = await this.countPlanetsInPositionRangeBySystem(
            this.homePlanetPosition.min, 
            this.homePlanetPosition.max
        );

        //This can be decreased to make smaller home planets density.
        let maxHomePlanetsInSystem = this.homePlanetPosition.max - this.homePlanetPosition.min + 1;

        //HOLY SHIET THAT IS THE MONSTER
        let availableSystems = 
            _.range(1, universeSize.galaxies + 1) //Create array with galaxy numbers, [1, 2, 3, ..., maxGalaxy];
            .map(galaxy => { 
                return { 
                    galaxy: galaxy, 
                    systems: _.range(1, universeSize.systems + 1) //Create array with system number, [1, 2, 3, ..., maxSystem]
                    .filter(system => {
                        if(galaxy === 1 && system <= reservedSystems) //Check is system isn't reserved for administration
                            return false;
                        let planetsInSystem = planetsInSystems.find(    //Get how many HOME planets positions is taken in this system
                            el => el.galaxy === galaxy && el.system === system
                        );
                        if(planetsInSystem) {
                            return planetsInSystem.planets < maxHomePlanetsInSystem; //Check if there's not too many planets on home positions
                        }
                        return true; //If there's no planets in this system at all, just return true, it's free
                    })
                } 
            })
            .filter(el => el.systems.length > 0); //Filter not available galaxies
        return availableSystems;
    }
    /** 
     * It's counting planets in specified position range (min, max) and group it by
     * galaxy and system.
     */
    private async countPlanetsInPositionRangeBySystem(min: number, max: number) {
        let planets = await getRepository(Planet)
            .createQueryBuilder("planet")
            .select("planet.galaxy", "galaxy")
            .addSelect("planet.system", "system")
            .addSelect("COUNT(planet.position)", "planets")
            .groupBy("galaxy")
            .addGroupBy("system")
            .where("planet.position BETWEEN :min AND :max", { min, max })
            .getRawMany() as [{ galaxy: number, system: number, planets: number }];
        return planets;
    }
    private async findAvailableHomePlanetPositionsForSystem(galaxy: number, system: number) {
        let planets = await Planet.find({ 
            where: { 
                galaxy: galaxy, 
                system: system,
                position: Between(this.homePlanetPosition.min, this.homePlanetPosition.max)
            }
        });
        let freePositions = 
        _.range(this.homePlanetPosition.min, this.homePlanetPosition.max + 1)
        .filter(pos => 
            planets.findIndex(planet => planet.position === pos) == -1);
            return freePositions;
    }
    private homePlanetConfig = uniConfig.get('homePlanet');
    private homePlanetPosition = this.homePlanetConfig.position;
}

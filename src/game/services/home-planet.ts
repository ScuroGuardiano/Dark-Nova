import uniConfig from "../../config/uni-config";
import Planet from "../../db/models/planet";
import * as _ from 'lodash';
import logger from "../../logger";
import { inspect } from "util";
import { getRepository } from "typeorm";


/**
 * This class will contain whole logic for fiding home planets
 * And home planets distribution in space
 * Unfortunately it will get complicated as f*ck, because I will write a lot of rules here
 */

export default class HomePlanetService {

    /** 
     * Returns available systems for home planets in format: 
     * { galaxy: galaxyNumber, systems: availableSystems[] }[]
    */
    public async getAvailableSystemsForHomePlanets() {
        const homePlanetPosition = uniConfig.get('homePlanet').position;
        const reservedSystems = uniConfig.get('reservedSystems');
        const universeSize = uniConfig.get('size');

        let planetsInSystems = await this.countPlanetsInPositionRangeBySystem(
            homePlanetPosition.min, 
            homePlanetPosition.max
        );

        //This can be decreased to make smaller home planets density.
        let maxHomePlanetsInSystem = homePlanetPosition.max - homePlanetPosition.min + 1;

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
    public async getAvailablePositionsForSystem(galaxy: number, system: number) {
        let planets = await Planet.find({ where: { galaxy: galaxy, system: system } });
        let freePositions = 
        _.range(1, uniConfig.get('size').planets + 1)
        .filter(pos => 
            planets.findIndex(planet => planet.position === pos) == -1);
            return freePositions;
    }
}
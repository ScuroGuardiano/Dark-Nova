import IShips from './ships';
import IDefense from './defense';
import IPlanetBuildings from './planet-buildings';

export default interface IPlanet {
    id: number;
    name: string;
    onwerName: string;
    // ECONOMY
    energy: number;
    energyUsage: number;
    maxFields: number;
    usedFields: number;

    metal: number;
    crystal: number;
    deuterium: number;

    metalPerHour: number;
    crystalPerHour: number;
    deuteriumPerHour: number;

    metalStorage: number;
    crystalStorage: number;
    deuteriumStorage: number;

    // COORDINATES
    galaxy: number;
    system: number;
    position: number;

    // SOME SH*T
    ships: IShips;
    defense: IDefense;
    buildings: IPlanetBuildings;

    // MISC
    diameter: number;
    minTemperature: number;
    maxTemperature: number;
    planetType: string;
}

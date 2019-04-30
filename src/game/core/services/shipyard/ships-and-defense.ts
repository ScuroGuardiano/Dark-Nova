import IWarEntityCostInfo from "../../../interfaces/war-entity-cost-info";
import { Resources } from "../../../data-types/resources";

export const SHIPS: IWarEntityCostInfo[] = [
    {
        key: "lightFighter",
        cost: new Resources(3000, 1000)
    },
    {
        key: "heavyFighter",
        cost: new Resources(6000, 4000)
    },
    {
        key: "cruiser",
        cost: new Resources(20000, 7000, 2000)
    },
    {
        key: "battleship",
        cost: new Resources(45000, 15000)
    },
    {
        key: "battlecruiser",
        cost: new Resources(30000, 40000, 15000)
    },
    {
        key: "destroyer",
        cost: new Resources(60000, 50000, 15000)
    },
    {
        key: "bomber",
        cost: new Resources(50000, 25000, 15000)
    },
    {
        key: "deathstar",
        cost: new Resources(5000000, 4000000, 1000000)
    },
    {
        key: "smallCargo",
        cost: new Resources(2000, 2000)
    },
    {
        key: "largeCargo",
        cost: new Resources(6000, 6000)
    },
    {
        key: "recycler",
        cost: new Resources(10000, 6000, 2000)
    },
    {
        key: "espionageProbe",
        cost: new Resources(0, 1000)
    },
    {
        key: "solarSatellite",
        cost: new Resources(0, 2000, 500)
    },
    {
        key: "colonyShip",
        cost: new Resources(10000, 20000, 10000)
    }
];

export const DEFENSE: IWarEntityCostInfo[] = [
    {
        key: "rocketLauncher",
        cost: new Resources(2000)
    },
    {
        key: "lightLaser",
        cost: new Resources(1500, 500)
    },
    {
        key: "heavyLaser",
        cost: new Resources(6000, 2000)
    },
    {
        key: "ionCannon",
        cost: new Resources(2000, 6000)
    },
    {
        key: "gaussCannon",
        cost: new Resources(20000, 15000, 2000)
    },
    {
        key: "plasmaTurret",
        cost: new Resources(50000, 50000, 30000)
    },
    {
        key: "smallShield",
        cost: new Resources(10000, 10000)
    },
    {
        key: "largeShield",
        cost: new Resources(50000, 50000)
    }
];

import Planet from "@db/models/planet";
import { Resources } from "../../../data-types/resources";
import { SHIPS, DEFENSE } from "./ships-and-defense";
import ShipyardSheluder from "./shipyard-sheluder";

export default class ShipyardService {
    constructor(private readonly planet: Planet) {}
    private sheluder: ShipyardSheluder;
    public get $sheluder() {
        return this.sheluder ? this.sheluder : this.sheluder = new ShipyardSheluder(this.planet);
    }
    public getShipCost(shipKey: string): Resources {
        const ship = SHIPS.find(s => s.key === shipKey);
        if(!ship)
            throw new Error(`Ship that has key: ${shipKey} doesn't exist!`);
        return ship.cost;
    }
    public getDefenseCost(defenseKey: string): Resources {
        const defense = DEFENSE.find(d => d.key === defenseKey);
        if(!defense)
            throw new Error(`Defense that has key: ${defenseKey} doesn't exist`);
        return defense.cost;
    }
}

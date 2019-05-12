import BuildQueue from "../building/build-queue";
import { PLANET_BUILDINGS } from "../../constants";
import Planet from "@db/models/planet";
import { Transaction, EntityManager, TransactionManager } from "typeorm";
import ShipyardTask, { ShipyardStructureType } from "@db/models/shipyard-task";
import { SHIPS, DEFENSE } from "./ships-and-defense";
import logger from "@logger";
import ShipyardQueue from "./shipyard-queue";
import { haveEnoughResources, subtractResources } from "../../utils";
import calculateShipyardTaskBuildTime from "./calculate-build-time";

export default class ShipyardSheluder {
    constructor(private planet: Planet) {}
    /**
     * Performing ACID operation of adding new shipyard task.
     * Loads planet again from DB in transaction
     * then saves it to database if modified resources
     */
    @Transaction({ isolation: "SERIALIZABLE" })
    private async sheludeShipyardTask(
        structureKey: string,
        structureType: ShipyardStructureType,
        amount = 1,
        @TransactionManager() manager?: EntityManager
    ) {
        if(!this.checkIfStructureIsAvailable(structureKey, structureType)) {
            logger.error(`Shipyard structure of type ${structureType} and key ${structureKey} isn't available or doesn't exist`);
            return false;
        }
        const planet = await manager.findOne(Planet, this.planet.id);
        const shipyardQueue = await new ShipyardQueue(planet).load(manager);


        if(shipyardQueue.isFull()) {
            logger.error(`Trying to create shipyard task while queue is full!`);
            return false;
        }
        
        if(this.isShield(structureKey, structureType)) {
            if(!this.canShieldBeBuilt(structureKey, planet, shipyardQueue)) {
                logger.error("Can't build more than one shield of a type!");
                return false;
            }
        }
        
        const structureCost = this.getStructureCost(structureKey, structureType);
        const totalCost = structureCost.multiplyBy(amount);
        // Unlike in build sheluder or research sheluder, we always take resources
        // At the moment of shelude, so it makes job much easier
        if(!haveEnoughResources(planet, { ...totalCost, energy: 0 }))
            return false;
        
        //TODO: T E C H N O L O G Y   C H E  C K
        const buildTime = calculateShipyardTaskBuildTime(totalCost, planet);
        const startTime = shipyardQueue.isEmpty() ? Date.now() : shipyardQueue.back().finishTime.getTime();
        const finishTime = startTime + buildTime;
        const task = ShipyardTask.createNew({
            planetId: planet.id,
            structureType: structureType,
            structureName: structureKey,
            amount: amount,
            startTime: new Date(startTime),
            finishTime: new Date(finishTime)
        });
        subtractResources(planet, totalCost);
        shipyardQueue.push(task);
        await shipyardQueue.save(manager);
        await manager.save(planet);
        return true;
    }
    private isShield(structureKey: string, structureType: ShipyardStructureType) {
        if(structureType === ShipyardStructureType.DEFENSE) {
            return structureKey.toLowerCase().includes("shield");
        }
        return false;
    }
    private canShieldBeBuilt(shieldKey: string, planet: Planet, queue: ShipyardQueue) {
        if(planet.defense[shieldKey] > 0)
            return false;
        if(queue.countElementsForStructureName(shieldKey) > 0)
            return false;
        return true;
    }
    private checkIfStructureIsAvailable(structureKey: string, structureType: ShipyardStructureType) {
        if(structureType === ShipyardStructureType.SHIP) {
            return SHIPS.findIndex(ship => ship.key === structureKey) !== -1;
        }
        return DEFENSE.findIndex(defense => defense.key === structureKey) !== -1;
    }
    private getStructureCost(structureKey: string, structureType: ShipyardStructureType) {
        if(structureType === ShipyardStructureType.SHIP) {
            return SHIPS.find(ship => ship.key === structureKey).cost;
        }
        return DEFENSE.find(defense => defense.key === structureKey).cost;
    }
    private async checkConditionsToShelude(transactionManager: EntityManager) {
        const buildQueue = await new BuildQueue(this.planet).load(transactionManager);
        const naniteFactoryBuild = buildQueue.countElementsForBuilding(PLANET_BUILDINGS.NANITE_FACTORY);
        const shipyardBuild = buildQueue.countElementsForBuilding(PLANET_BUILDINGS.SHIPYARD);
        // There's no nanite factory and shipyard in planet's build queue
        // Shipyard can't start doing things if nanite factory or shipyard is in build queue!
        return !naniteFactoryBuild && !shipyardBuild;
    }
}
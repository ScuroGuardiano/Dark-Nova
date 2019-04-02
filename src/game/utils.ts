import { IResourcesAndEnergy, IResources } from "./data-types/resources";

export function haveEnoughResources(resources: IResourcesAndEnergy, required: IResourcesAndEnergy): boolean {
    return resources.metal >= required.metal &&
        resources.crystal >= required.crystal &&
        resources.deuter >= required.deuter &&
        resources.energy >= required.energy;
}
export function addResources(x: IResources, y: IResources): IResources {
    return {
        metal: x.metal + y.metal,
        crystal: x.crystal + y.crystal,
        deuter: x.deuter + y.deuter
    };
}
export function subtractResources(from: IResources, subtrahend: IResources): IResources {
    from.metal -= subtrahend.metal;
    from.crystal -= subtrahend.crystal;
    from.deuter -= subtrahend.deuter;
    return from;
}

const buildings: { [key: string]: string } = {
    metalMine: "Metal mine",
    crystalMine: "Crystal mine",
    deuteriumSynthesizer: "Deuterium synthesizer",
    solarPlant: "Solar plant",
    fusionReactor: "Fusion reactor",
    metalStorage: "Metal storage",
    crystalStorage: "Crystal storage",
    deuteriumStorage: "Deuterium tank",
    robotFactory: "Robotics factory",
    nanoFactory: "Nano factory",
    shipyard: "Shipyard",
    laboratory: "Research lab",
    missileSilo: "Missile silo",
    terraformer: "Terraformer",
    allianceDepot: "Alliance depot",
    spaceDock: "Space dock"
};
const technologies: { [key: string]: string } = {
    energyTechnology: "Energy Technology",
    laserTechnology: "Laser Technology",
    ionTechnology: "Ion Technology",
    hyperspaceTechnology: "Hyperspace Technology",
    plasmaTechnology: "Plasma Technology",
    espionageTechnology: "Espionage Technology",
    computerTechnology: "Computer Technology",
    astrophysics: "Astrophysics",
    network: "Intergalactic Research Network",
    gravitonTechnology: "Graviton Technology",
    combustionDrive: "Combustion Drive",
    impulseDrive: "Impulse Drive",
    hyperspaceDrive: "Hyperspace Drive",
    weaponTechnology: "Weapon Technology",
    shieldingTechnology: "Shielding Technology",
    armourTechnology: "Armour Technology"
};
const ships: { [key: string]: string } = {
    //TODO
};
export function getBuidingNameByKey(buildingKey: string) {
    return buildings[buildingKey];
}
export function getTechNameByKey(techKey: string) {
    return technologies[techKey];
}

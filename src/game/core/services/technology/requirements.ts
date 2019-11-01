import { IRequirementList } from "./i-requirement-list";

export const buildings: IRequirementList = {
    metalMine: {},
    crystalMine: {},
    deuteriumSynthesizer: {},
    solarPlant: {},
    fusionReactor: {
        buildings: {
            deuteriumSynthesizer: 5
        },
        research: {
            energyTechnology: 3
        }
    },
    metalStorage: {},
    crystalStorage: {},
    deuteriumStorage: {},
    robotFactory: {},
    nanoFactory: {
        buildings: {
            robotFactory: 10
        },
        research: {
            computerTechnology: 10
        }
    },
    shipyard: {
        buildings: {
            robotFactory: 2
        }
    },
    laboratory: {},
    missileSilo: {
        buildings: {
            shipyard: 1
        }
    },
    terraformer: {
        buildings: {
            nanoFactory: 1
        },
        research: {
            energyTechnology: 12
        }
    },
    allianceDepot: {},
    spaceDock: {
        buildings: {
            shipyard: 2
        }
    }
};

export const technologies: IRequirementList = {
    energyTechnology: {
        buildings: {
            laboratory: 1
        }
    },
    laserTechnology: {
        buildings: {
            laboratory: 1
        },
        research: {
           energyTechnology: 2
        }
    },
    ionTechnology: {
        buildings: {
            laboratory: 4
        },
        research: {
            laserTechnology: 5,
            energyTechnology: 4
        }
    },
    hyperspaceTechnology: {
        buildings: {
            laboratory: 7
        },
        research: {
            energyTechnology: 5,
            shieldingTechnology: 5
        }
    },
    plasmaTechnology: {
        buildings: {
            laboratory: 4
        },
        research: {
            energyTechnology: 8,
            laserTechnology: 10,
            ionTechnology: 5
        }
    },
    espionageTechnology: {
        buildings: {
            laboratory: 3
        }
    },
    computerTechnology: {
        buildings: {
            laboratory: 1
        }
    },
    astrophysics: {
        buildings: {
            laboratory: 3
        },
        research: {
            espionageTechnology: 4,
            hyperspaceDrive: 3
        }
    },
    network: {
        buildings: {
            laboratory: 10
        },
        research: {
            computerTechnology: 8,
            hyperspaceTechnology: 8
        }
    },
    gravitonTechnology: {
        buildings: {
            laboratory: 12
        }
    },
    combustionDrive: {
        buildings: {
            laboratory: 1
        },
        research: {
            energyTechnology: 1
        }
    },
    impulseDrive: {
        buildings: {
            laboratory: 2
        },
        research: {
            energyTechnology: 1
        }
    },
    hyperspaceDrive: {
        buildings: {
            laboratory: 7
        },
        research: {
            hyperspaceTechnology: 3
        }
    },
    weaponTechnology: {
        buildings: {
            laboratory: 4
        }
    },
    shieldingTechnology: {
        buildings: {
            laboratory: 6
        },
        research: {
            energyTechnology: 3
        }
    },
    armourTechnology: {
        buildings: {
            laboratory: 2
        }
    }
};

export const ships: IRequirementList = {
    smallCargo: {
        buildings: {
            shipyard: 2
        },
        research: {
            combustionDrive: 2
        }
    },
    largeCargo: {
        buildings: {
            shipyard: 4
        },
        research: {
            combustionDrive: 6
        }
    },
    lightFighter: {
        buildings: {
            shipyard: 1
        },
        research: {
            combustionDrive: 1
        }
    },
    heavyFighter: {
        buildings: {
            shipyard: 3
        },
        research: {
            impulseDrive: 2,
            armourTechnology: 2
        }
    },
    cruiser: {
        buildings: {
            shipyard: 5
        },
        research: {
            impulseDrive: 4,
            ionTechnology: 2
        }
    },
    battleship: {
        buildings: {
            shipyard: 7
        },
        research: {
            hyperspaceDrive: 4
        }
    },
    battlecruiser: {
        buildings: {
            shipyard: 8
        },
        research: {
            hyperspaceDrive: 5,
            hyperspaceTechnology: 5,
            laserTechnology: 12
        }
    },
    bomber: {
        buildings: {
            shipyard: 8
        },
        research: {
            impulseDrive: 6,
            plasmaTechnology: 5
        }
    },
    destroyer: {
        buildings: {
            shipyard: 9
        },
        research: {
            hyperspaceDrive: 6,
            hyperspaceTechnology: 5
        }
    },
    deathstar: {
        buildings: {
            shipyard: 12
        },
        research: {
            hyperspaceDrive: 7,
            hyperspaceTechnology: 6,
            gravitonTechnology: 1
        }
    },
    recycler: {
        buildings: {
            shipyard: 4
        },
        research: {
            combustionDrive: 6,
            shieldingTechnology: 2
        }
    },
    espionageProbe: {
        buildings: {
            shipyard: 3
        },
        research: {
            combustionDrive: 3,
            espionageTechnology: 2
        }
    },
    solarSatellite: {
        buildings: {
            shipyard: 1
        }
    },
    colonyShip: {
        buildings: {
            shipyard: 4
        },
        research: {
            impulseDrive: 3
        }
    }
};
export const defense: IRequirementList = {
    rocketLauncher: {
        buildings: {
            shipyard: 1
        }
    },
    lightLaser: {
        buildings: {
            shipyard: 2
        },
        research: {
            laserTechnology: 3,
            energyTechnology: 1
        }
    },
    heavyLaser: {
        buildings: {
            shipyard: 4
        },
        research: {
            energyTechnology: 3,
            laserTechnology: 6
        }
    },
    ionCannon: {
        buildings: {
            shipyard: 4
        },
        research: {
            ionTechnology: 4
        }
    },
    gaussCannon: {
        buildings: {
            shipyard: 6
        },
        research: {
            energyTechnology: 6,
            weaponTechnology: 3,
            shieldingTechnology: 1
        }
    },
    plasmaTurret: {
        buildings: {
            shipyard: 8
        },
        research: {
            plasmaTechnology: 7
        }
    },
    smallShieldDome: {
        buildings: {
            shipyard: 1
        },
        research: {
            shieldingTechnology: 2
        }
    },
    largeShieldDome: {
        buildings: {
            shipyard: 6
        },
        research: {
            shieldingTechnology: 6
        }
    }
};
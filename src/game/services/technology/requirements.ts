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

};
export const defense: IRequirementList = {

};
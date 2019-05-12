import * as convict from 'convict';
import * as fs from 'fs';

function strictNumber(val: any) {
    if(!Number.isFinite(val))
        throw new Error("must be a number.");
}

const uniConfig = convict({
    size: {
        galaxies: { format: "int", default: 9 },
        systems: { format: "int", default: 499 },
        planets: { format: "int", default: 15 }
    },
    speed: {
        fleet: { format: strictNumber, default: 1 },
        buildings: { format: strictNumber, default: 1 },
        research: { format: strictNumber, default: 1 },
        shipyard: { format: strictNumber, default: 1 },
        production: { format: strictNumber, default: 1 }
    },
    storageMultipler: { format: strictNumber, default: 1 },
    baseProductions: {
        metal: { format: "int", default: 120 },
        crystal: { format: "int", default: 70 },
        deuter: { format: "int", default: 0 },
        energy: { format: "int", default: 0 }
    },
    homePlanet: {
        fields: {
            min: { format: "int", default: 163 },
            max: { format: "int", default: 163 }
        },
        diameter: { format: "int", default: 12800 },
        position: {
            min: { format: "int", default: 4 },
            max: { format: "int", default: 12}
        },
        startingResources: {
            metal: { format: "int", default: 500 },
            crystal: { format: "int", default: 500 },
            deuter: { format: "int", default: 0 }
        }
    },
    reservedSystems: {
        doc: "Number of first systems in galactic 1 reserved for administration",
        format: 'int',
        default: 2
    },
    planets: {
        "1": {
            size: {
                min: { format: "int", default: 56 },
                max: { format: "int", default: 113 }
            },
            temperature: {
                min: { format: "int", default: 200 },
                max: { format: "int", default: 240 }
            },
            type: {
                systemNumberOdd: { format: String, default: "dry" },
                systemNumberEven: { format: String, default: "desert" }
            }
         },
        "2": {
            size: {
                min: { format: "int", default: 98 },
                max: { format: "int", default: 110 }
            },
            temperature: {
                min: { format: "int", default: 150 },
                max: { format: "int", default: 190 }
            },
            type: {
                systemNumberOdd: { format: String, default: "dry" },
                systemNumberEven: { format: String, default: "desert" }
            }
        },
        "3": {
            size: {
                min: { format: "int", default: 101 },
                max: { format: "int", default: 137 }
            },
            temperature: {
                min: { format: "int", default: 100 },
                max: { format: "int", default: 140 }
            },
            type: {
                systemNumberOdd: { format: String, default: "dry" },
                systemNumberEven: { format: String, default: "desert" }
            }
        },
        "4": {
            size: {
                min: { format: "int", default: 89 },
                max: { format: "int", default: 199 }
            },
            temperature: {
                min: { format: "int", default: 50 },
                max: { format: "int", default: 90 }
            },
            type: {
                systemNumberOdd: { format: String, default: "normal" },
                systemNumberEven: { format: String, default: "dry" }
            }
        },
        "5": {
            size: {
                min: { format: "int", default: 145 },
                max: { format: "int", default: 225 }
            },
            temperature: {
                min: { format: "int", default: 40 },
                max: { format: "int", default: 80 }
            },
            type: {
                systemNumberOdd: { format: String, default: "normal" },
                systemNumberEven: { format: String, default: "dry" }
            }
        },
        "6": {
            size: {
                min: { format: "int", default: 104 },
                max: { format: "int", default: 225 }
            },
            temperature: {
                min: { format: "int", default: 30 },
                max: { format: "int", default: 70 }
            },
            type: {
                systemNumberOdd: { format: String, default: "jungle" },
                systemNumberEven: { format: String, default: "normal" }
            }
        },
        "7": {
            size: {
                min: { format: "int", default: 161 },
                max: { format: "int", default: 242 }
            },
            temperature: {
                min: { format: "int", default: 20 },
                max: { format: "int", default: 60 }
            },
            type: {
                systemNumberOdd: { format: String, default: "jungle" },
                systemNumberEven: { format: String, default: "normal" }
            }
        },
        "8": {
            size: {
                min: { format: "int", default: 164 },
                max: { format: "int", default: 256 }
            },
            temperature: {
                min: { format: "int", default: 10 },
                max: { format: "int", default: 50 }
            },
            type: {
                systemNumberOdd: { format: String, default: "water" },
                systemNumberEven: { format: String, default: "jungle" }
            }
        },
        "9": {
            size: {
                min: { format: "int", default: 163 },
                max: { format: "int", default: 247 }
            },
            temperature: {
                min: { format: "int", default: 0 },
                max: { format: "int", default: 40 }
            },
            type: {
                systemNumberOdd: { format: String, default: "water" },
                systemNumberEven: { format: String, default: "jungle" }
            }
        },
        "10": {
            size: {
                min: { format: "int", default: 62 },
                max: { format: "int", default: 219 }
            },
            temperature: {
                min: { format: "int", default: -10 },
                max: { format: "int", default: 30 }
            },
            type: {
                systemNumberOdd: { format: String, default: "ice" },
                systemNumberEven: { format: String, default: "water" }
            }
        },
        "11": {
            size: {
                min: { format: "int", default: 84 },
                max: { format: "int", default: 204 }
            },
            temperature: {
                min: { format: "int", default: -20 },
                max: { format: "int", default: 20 }
            },
            type: {
                systemNumberOdd: { format: String, default: "ice" },
                systemNumberEven: { format: String, default: "water" }
            }
        },
        "12": {
            size: {
                min: { format: "int", default: 76 },
                max: { format: "int", default: 200 }
            },
            temperature: {
                min: { format: "int", default: -30 },
                max: { format: "int", default: 10 }
            },
            type: {
                systemNumberOdd: { format: String, default: "gas" },
                systemNumberEven: { format: String, default: "ice" }
            }
        },
        "13": {
            size: {
                min: { format: "int", default: 107 },
                max: { format: "int", default: 161 }
            },
            temperature: {
                min: { format: "int", default: -70 },
                max: { format: "int", default: -30 }
            },
            type: {
                systemNumberOdd: { format: String, default: "gas" },
                systemNumberEven: { format: String, default: "ice" }
            }
        },
        "14": {
            size: {
                min: { format: "int", default: 64 },
                max: { format: "int", default: 94 }
            },
            temperature: {
                min: { format: "int", default: -110 },
                max: { format: "int", default: -70 }
            },
            type: {
                systemNumberOdd: { format: String, default: "nomal" },
                systemNumberEven: { format: String, default: "gas" }
            }
        },
        "15": {
            size: {
                min: { format: "int", default: 66 },
                max: { format: "int", default: 85 }
            },
            temperature: {
                min: { format: "int", default: -180 },
                max: { format: "int", default: -110 }
            },
            type: {
                systemNumberOdd: { format: String, default: "normal" },
                systemNumberEven: { format: String, default: "gas" }
            }
        }
    },
    buildQueueLimit: {
        normal: { format: "int", default: 1 },
        premium: { format: "int", default: 5 }
    },
    researchQueueLimit: {
        normal: { format: "int", default: 1 },
        premium: { format: "int", default: 5 }
    },
    shipyardQueueLimit: {
        normal: { format: "int", default: 100 },
        premium: { format: "int", default: 200 }
    }
});

try {
    uniConfig.loadFile('./config/uni-config.json');
    try {
        uniConfig.validate({ allowed: 'strict' });
    }
    catch(err) {
        throw { type: "Validation Error", err: err };
    }
}
catch(err) {
    if(err.type === "Validation Error") {
        throw new Error(
            "Universe Config Validation Error! Your universe config is invalid, correct it or delete it to create a default new one.\n" +
            `Error details: ${err.err.message}`
        );
    }
    const data = JSON.stringify(uniConfig.getProperties(), null, 4);
    fs.writeFile('./config/uni-config.json', data, err => {
        if(!err)
            console.log("Created file ./config/uni-config.json, where you can adjust universe settings.");
    });
}

export default uniConfig;
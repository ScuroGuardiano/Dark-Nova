/*
Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, Index, ManyToOne, JoinColumn, OneToOne, AfterLoad } from 'typeorm';
import Player from './player';
import PlanetBuildings from './planet-buildings';
import IPlanetData from '../../game/data-types/planet-data';
import { IResourcesAndEnergy } from '../../game/data-types/resources';
import IEconomyData from '../../game/data-types/economy-data';
import EconomyCalculator from '../../game/services/economy-calculator';

@Entity()
@Index(['galaxy', 'system', 'position'], { unique: true })
export default class Planet extends BaseEntity implements IResourcesAndEnergy {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    //Last update from Updater
    @Column()
    lastUpdate: Date;

    @Column()
    name: string;

    @Column({ nullable: false })
    playerId: number;

    @ManyToOne(type => Player)
    player: Player;

    @OneToOne(type => PlanetBuildings, {
        eager: true,
        cascade: true
    })
    @JoinColumn()
    buildings: PlanetBuildings;

    @Column({ type: "int", nullable: false })
    galaxy: number;

    @Column({ type: "int", nullable: false })
    system: number;

    @Column({ type: "int", nullable: false })
    position: number;

    /** Planet type, e.g dry, desert etc. */
    @Column({ nullable: false })
    planetType: string;

    @Column({ type: "bigint", default: 0, nullable: false })
    metal: number;

    @Column({ type: "bigint", default: 0, nullable: false })
    crystal: number;

    @Column({ type: "bigint", default: 0, nullable: false})
    deuter: number;

    @Column({ type: 'int', nullable: false })
    diameter: number;

    @Column({ type: 'smallint', nullable: false })
    maxFields: number;
    
    @Column({ type: 'smallint', nullable: false })
    maxTemperature: number;
    
    @Column( { type: 'smallint', nullable: false })
    minTemperature: number;
    
    @AfterLoad()
    public calculateEconomy() {
        let economyCalculator = new EconomyCalculator(this);
        this.economyData = economyCalculator.calculateEconomy();
    }
    public static findPlanetByCoords(galaxy: number, system: number, position: number): Promise<Planet> {
        return this.findOne({ where: { galaxy, system, position }})
    }
    public static async isPlanetExistsByCoords(galaxy: number, system: number, position: number): Promise<boolean> {
        let planets = await this.count({ where: { galaxy: galaxy, system: system, position: position } });
        return planets > 0;
    }
    public static createPlanet(playerId: number, planetData: IPlanetData, planetBuildings: PlanetBuildings = new PlanetBuildings()) {
        let planet = new Planet();
        planet.buildings = planetBuildings;

        planet.playerId = playerId;
        planet.name = planetData.name;
        planet.planetType = planetData.planetType;
        planet.lastUpdate = new Date();

        //Coords
        planet.galaxy = planetData.coords.galaxy;
        planet.system = planetData.coords.system;
        planet.position = planetData.coords.position;
        //Size
        planet.maxFields = planetData.maxFields;
        planet.diameter = planetData.diameter;
        //Temperature
        planet.minTemperature = planetData.temperature.min;
        planet.maxTemperature = planetData.temperature.max;
        //Resources
        if(planetData.resources) {
            planet.metal = planetData.resources.metal;
            planet.crystal = planetData.resources.crystal;
            planet.deuter = planetData.resources.deuter;
        }
        planet.calculateEconomy();
        return planet;
    }
    //TODO: Zone
    public get energy() {
        return this.economyData.energy.production;
    }
    public get usedEnergy() {
        return this.economyData.energy.usage;
    }
    public get usedFields() {
        let buildingsList = this.buildings.getBuildingsList();
        let totalBuildings = buildingsList.reduce((previous, current) => {
            return previous + current.level;
        }, 0);
        return totalBuildings;
    }
    public get metalPerHour() {
        return this.economyData.production.metal;
    }
    public get crystalPerHour() {
        return this.economyData.production.crystal;
    }
    public get deuteriumPerHour() {
        return this.economyData.production.deuter;
    }
    public get metalStorage() {
        return 5000 * Math.floor(2.5 * Math.exp(20 * this.buildings.metalStorage / 33));
    }
    public get crystalStorage() {
        return 5000 * Math.floor(2.5 * Math.exp(20 * this.buildings.crystalStorage / 33));
    }
    public get deuteriumStorage() {
        return 5000 * Math.floor(2.5 * Math.exp(20 * this.buildings.deuteriumStorage / 33));
    }
    /** Production of each building, energy usage of each building etc. */
    public getEconomyDetails() {
        return this.economyData;
    }
    private economyData: IEconomyData;
}

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
    //TODO: Zone
    public get energy(): number {
        return this.economyData.energy.production;
    }
    public get usedEnergy(): number {
        return this.economyData.energy.usage;
    }
    public get usedFields(): number {
        const buildingsList = this.buildings.getBuildingsList();
        const totalBuildings = buildingsList.reduce((previous, current) => {
            return previous + current.level;
        }, 0);
        return totalBuildings;
    }
    public get metalPerHour(): number {
        return this.economyData.production.metal;
    }
    public get crystalPerHour(): number {
        return this.economyData.production.crystal;
    }
    public get deuteriumPerHour(): number {
        return this.economyData.production.deuter;
    }
    public get metalStorage(): number {
        return 5000 * Math.floor(2.5 * Math.exp(20 * this.buildings.metalStorage / 33));
    }
    public get crystalStorage(): number {
        return 5000 * Math.floor(2.5 * Math.exp(20 * this.buildings.crystalStorage / 33));
    }
    public get deuteriumStorage(): number {
        return 5000 * Math.floor(2.5 * Math.exp(20 * this.buildings.deuteriumStorage / 33));
    }
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    //Last update from Updater
    @Column()
    public lastUpdate: Date;

    @Column()
    public name: string;

    @Column({ nullable: false })
    public playerId: number;

    @ManyToOne(type => Player)
    public player: Player;

    @OneToOne(type => PlanetBuildings, {
        eager: true,
        cascade: true
    })
    @JoinColumn()
    public buildings: PlanetBuildings;

    @Column({ type: "int", nullable: false })
    public galaxy: number;

    @Column({ type: "int", nullable: false })
    public system: number;

    @Column({ type: "int", nullable: false })
    public position: number;

    /** Planet type, e.g dry, desert etc. */
    @Column({ nullable: false })
    public planetType: string;

    @Column({ type: "double", default: 0, nullable: false })
    public metal: number;

    @Column({ type: "double", default: 0, nullable: false })
    public crystal: number;

    @Column({ type: "double", default: 0, nullable: false})
    public deuter: number;

    @Column({ type: 'int', nullable: false })
    public diameter: number;

    @Column({ type: 'smallint', nullable: false })
    public maxFields: number;

    @Column({ type: 'smallint', nullable: false })
    public maxTemperature: number;

    @Column( { type: 'smallint', nullable: false })
    public minTemperature: number;
    private economyData: IEconomyData;
    public static async findPlanetByCoords(galaxy: number, system: number, position: number): Promise<Planet> {
        return this.findOne({ where: { galaxy, system, position }});
    }
    public static async isPlanetExistsByCoords(galaxy: number, system: number, position: number): Promise<boolean> {
        const planets = await this.count({ where: { galaxy: galaxy, system: system, position: position } });
        return planets > 0;
    }
    public static createPlanet(playerId: number, planetData: IPlanetData, planetBuildings: PlanetBuildings = new PlanetBuildings()) {
        const planet = new Planet();
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

    @AfterLoad()
    public calculateEconomy(): void {
        const economyCalculator = new EconomyCalculator(this);
        this.economyData = economyCalculator.calculateEconomy();
    }
    /** Production of each building, energy usage of each building etc. */
    public getEconomyDetails() {
        return this.economyData;
    }
}

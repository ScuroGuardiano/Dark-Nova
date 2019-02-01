/*
Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, Index, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import Player from './player';
import PlanetBuildings from './planet-buildings';
import IPlanetData from '../../game/data-types/planet-data';

@Entity()
@Index(['galaxy', 'system', 'position'], { unique: true })
export default class Planet extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    name: string;

    @Column({ nullable: false })
    playerId: number;

    @ManyToOne(type => Player)
    player: Player;

    @OneToOne(type => PlanetBuildings, {
        eager: true
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
    
    
    public static findPlanetByCoords(galaxy: number, system: number, position: number): Promise<Planet> {
        return this.findOne({ where: { galaxy, system, position }})
    }
    public static async isPlanetExistsByCoords(galaxy: number, system: number, position: number): Promise<boolean> {
        return await this.count({ where: { galaxy, system, position }}) > 0;
    }
    public static createPlanet(playerId: number, planetData: IPlanetData, planetBuildings: PlanetBuildings = new PlanetBuildings()) {
        let planet = new Planet();
        planet.buildings = planetBuildings;

        planet.playerId = playerId;
        planet.name = planetData.name;
        planet.planetType = planetData.planetType;

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
        return planet;
    }
    /*
    //TODO: Zone
    public get energy() {
        return 0;
    }
    public get usedEnergy() {
        return 0;
    }
    public get usedFields() {
        return 0;
    }
    public get metalPerHour() {
        return 0;
    }
    public get crystalPerHour() {
        return 0;
    }
    public get deuteriumPerHour() {
        return 0;
    }
    public get metalStorage() {
        return 0;
    }
    public get crystalStorage() {
        return 0;
    }
    public get deuteriumStorage() {
        return 0;
    }*/
    /** Production of each building, energy usage of each building etc. */
    /*public getEconomyDetails() {
        return { };
    }*/
}

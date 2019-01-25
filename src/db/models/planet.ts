/*
Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, Index, ManyToOne, JoinColumn } from 'typeorm';
import Player from './player';

@Entity()
@Index(['galaxy', 'system', 'position'], { unique: true })
export default class Planet extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ nullable: false })
    playerId: number;

    @ManyToOne(type => Player)
    player: Player;

    @Column({ type: "int", nullable: false })
    galaxy: number;

    @Column({ type: "int", nullable: false })
    system: number;

    @Column({ type: "int", nullable: false })
    position: number;

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
    }
    /** Production of each building, energy usage of each building etc. */
    public getEconomyDetails() {
        return { };
    }
}

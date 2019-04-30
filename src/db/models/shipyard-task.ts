/*
Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import ITask from "game/interfaces/task";


export enum ShipyardStructureType {
    SHIP = "ship",
    DEFENSE = "defense"
}

@Entity()
export default class ShipyardTask extends BaseEntity implements ITask {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column()
    public structureType: ShipyardStructureType;

    @Column({ nullable: false })
    public planetId: number;

    @Column({ nullable: false })
    public structureName: string;

    @Column({ default: 1 })
    public amount: number;

    @Column({ nullable: false })
    public startTime: Date;

    @Column({ nullable: false })
    public finishTime: Date;

    public static createNew(
        { planetId, structureType, structureName, startTime, finishTime }: 
        { planetId: number; structureType: ShipyardStructureType; structureName: string; startTime: Date; finishTime: Date; }
    ) {
        const shipyardTask = new ShipyardTask();
        shipyardTask.planetId = planetId;
        shipyardTask.structureName = structureName;
        shipyardTask.structureType = structureType;
        shipyardTask.startTime = startTime;
        shipyardTask.finishTime = finishTime;
    }
}

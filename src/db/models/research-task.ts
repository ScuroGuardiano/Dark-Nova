/*
Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import ITask from '../../game/interfaces/task';

@Entity()
export default class ResearchTask extends BaseEntity implements ITask {

    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({ nullable: false })
    public planetId: number;

    @Column({ nullable: false })
    public playerId: number;

    @Column({ nullable: false })
    public researchName: string;

    @Column({ nullable: false })
    public startTime: Date;

    @Column({ nullable: false })
    public finishTime: Date;
    public static createNew(planetId: number, playerId: number, researchName: string, startTime: Date, finishTime: Date) {
        const task = new ResearchTask();
        task.planetId = planetId;
        task.playerId = playerId;
        task.researchName = researchName;
        task.startTime = startTime;
        task.finishTime = finishTime;
        return task;
    }
}

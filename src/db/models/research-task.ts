/*
Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export default class ResearchTask extends BaseEntity {
    public static createNew(planetId: number, playerId: number, researchName: string, startTime: Date, finishTime: Date) {
        let task = new ResearchTask();
        task.planetId = planetId;
        task.playerId = playerId;
        task.researchName = researchName;
        task.startTime = startTime;
        task.finishTime = finishTime;
        return task;
    }

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ nullable: false })
    planetId: number;

    @Column({ nullable: false })
    playerId: number;

    @Column({ nullable: false })
    researchName: string;

    @Column({ nullable: false })
    startTime: Date;

    @Column({ nullable: false })
    finishTime: Date;
}

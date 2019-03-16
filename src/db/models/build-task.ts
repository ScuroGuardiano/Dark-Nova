/*
Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import Planet from './planet';
import ITask from '../../game/interfaces/task';

export enum BuildTaskType {
    BUILD = "build",
    DESTROY = "destroy"
}

@Entity()
export default class BuildTask extends BaseEntity implements ITask {
    public static createNew(planet: Planet, buildingName: string, startTime: Date, finishTime: Date, taskType = BuildTaskType.BUILD) {
        let buildTask = new BuildTask();
        buildTask.planet = planet;
        buildTask.buildingName = buildingName;
        buildTask.startTime = startTime;
        buildTask.finishTime = finishTime;
        buildTask.taskType = taskType;
        return buildTask;
    }

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ default: BuildTaskType.BUILD })
    taskType: BuildTaskType;

    @ManyToOne(type => Planet)
    @JoinColumn()
    planet: Planet;

    @Column({ nullable: false })
    planetId: number;

    @Column({ nullable: false })
    buildingName: string;

    @Column({ nullable: false })
    startTime: Date;

    @Column({ nullable: false })
    finishTime: Date;
}

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

    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({ default: BuildTaskType.BUILD })
    public taskType: BuildTaskType;

    @ManyToOne(type => Planet)
    @JoinColumn()
    public planet: Planet;

    @Column({ nullable: false })
    public planetId: number;

    @Column({ nullable: false })
    public buildingName: string;

    @Column({ nullable: false })
    public startTime: Date;

    @Column({ nullable: false })
    public finishTime: Date;
    public static createNew(planet: Planet, buildingName: string, startTime: Date, finishTime: Date, taskType = BuildTaskType.BUILD) {
        const buildTask = new BuildTask();
        buildTask.planet = planet;
        buildTask.buildingName = buildingName;
        buildTask.startTime = startTime;
        buildTask.finishTime = finishTime;
        buildTask.taskType = taskType;
        return buildTask;
    }
}

/*
Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export default class PlanetBuildings extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('smallint', { default: 0, nullable: false })
    metalMine: number;

    @Column('smallint', { default: 0, nullable: false })
    crystalMine: number;

    @Column('smallint', { default: 0, nullable: false })
    deuteriumSynthesizer: number;

    @Column('smallint', { default: 0, nullable: false })
    solarPlant: number;

    @Column('smallint', { default: 0, nullable: false })
    fusionReactor: number;

    @Column('smallint', { default: 0, nullable: false })
    metalStorage: number;

    @Column('smallint', { default: 0, nullable: false })
    crystalStorage: number;

    @Column('smallint', { default: 0, nullable: false })
    deuteriumStorage: number;

    @Column('smallint', { default: 0, nullable: false })
    robotFactory: number;

    @Column('smallint', { default: 0, nullable: false })
    nanoFactory: number;

    @Column('smallint', { default: 0, nullable: false })
    shipyard: number;

    @Column('smallint', { default: 0, nullable: false })
    laboratory: number;

    @Column('smallint', { default: 0, nullable: false })
    missileSilo: number;

    @Column('smallint', { default: 0, nullable: false })
    terraformer: number;

    @Column('smallint', { default: 0, nullable: false })
    allianceDepot: number;

    @Column('smallint', { default: 0, nullable: false })
    spaceDock: number;
}

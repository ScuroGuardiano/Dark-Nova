/*
Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export default class PlanetBuildings extends BaseEntity {
    [Key: string]: any;

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('smallint', { default: 0, nullable: false })
    metalMine: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    crystalMine: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    deuteriumSynthesizer: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    solarPlant: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    fusionReactor: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    metalStorage: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    crystalStorage: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    deuteriumStorage: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    robotFactory: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    nanoFactory: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    shipyard: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    laboratory: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    missileSilo: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    terraformer: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    allianceDepot: number = 0;

    @Column('smallint', { default: 0, nullable: false })
    spaceDock: number = 0;

    public getBuildingsList() {
        return [
            { key: "metalMine", level: this.metalMine },
            { key: "crystalMine", level: this.crystalMine },
            { key: "deuteriumSynthesizer", level: this.deuteriumSynthesizer },
            { key: "solarPlant", level: this.solarPlant },
            { key: "fusionReactor", level: this.fusionReactor },
            { key: "metalStorage", level: this.metalStorage },
            { key: "crystalStorage", level: this.crystalStorage },
            { key: "deuteriumStorage", level: this.deuteriumStorage },
            { key: "robotFactory", level: this.robotFactory },
            { key: "nanoFactory", level: this.nanoFactory },
            { key: "shipyard", level: this.shipyard },
            { key: "laboratory", level: this.laboratory },
            { key: "missileSilo", level: this.missileSilo },
            { key: "terraformer", level: this.terraformer },
            { key: "allianceDepot", level: this.allianceDepot },
            { key: "spaceDock", level: this.spaceDock }
        ];
    }
}

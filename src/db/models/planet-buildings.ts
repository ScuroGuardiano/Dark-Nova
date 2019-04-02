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
    public id: number;

    @Column('smallint', { default: 0, nullable: false })
    public metalMine = 0;

    @Column('smallint', { default: 0, nullable: false })
    public crystalMine = 0;

    @Column('smallint', { default: 0, nullable: false })
    public deuteriumSynthesizer = 0;

    @Column('smallint', { default: 0, nullable: false })
    public solarPlant = 0;

    @Column('smallint', { default: 0, nullable: false })
    public fusionReactor = 0;

    @Column('smallint', { default: 0, nullable: false })
    public metalStorage = 0;

    @Column('smallint', { default: 0, nullable: false })
    public crystalStorage = 0;

    @Column('smallint', { default: 0, nullable: false })
    public deuteriumStorage = 0;

    @Column('smallint', { default: 0, nullable: false })
    public robotFactory = 0;

    @Column('smallint', { default: 0, nullable: false })
    public nanoFactory = 0;

    @Column('smallint', { default: 0, nullable: false })
    public shipyard = 0;

    @Column('smallint', { default: 0, nullable: false })
    public laboratory = 0;

    @Column('smallint', { default: 0, nullable: false })
    public missileSilo = 0;

    @Column('smallint', { default: 0, nullable: false })
    public terraformer = 0;

    @Column('smallint', { default: 0, nullable: false })
    public allianceDepot = 0;

    @Column('smallint', { default: 0, nullable: false })
    public spaceDock = 0;

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

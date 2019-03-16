import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class Research extends BaseEntity {
    [Key: string]: any;
    @PrimaryGeneratedColumn('increment')
    id: number;
    //Basic
    @Column('smallint', { nullable: false, default: 0 })
    energyTechnology: number = 0;
    @Column('smallint', { nullable: false, default: 0 })
    laserTechnology: number = 0;
    @Column('smallint', { nullable: false, default: 0 })
    ionTechnology: number = 0;
    @Column('smallint', { nullable: false, default: 0 })
    hyperspaceTechnology: number = 0;
    @Column('smallint', { nullable: false, default: 0 })
    plasmaTechnology: number = 0;
    //Advanced
    @Column('smallint', { nullable: false, default: 0 })
    espionageTechnology: number = 0;
    @Column('smallint', { nullable: false, default: 0 })
    computerTechnology: number = 0;
    @Column('smallint', { nullable: false, default: 0 })
    astrophysics: number = 0;
    @Column('smallint', { nullable: false, default: 0 })
    network: number = 0; //Intergalactic Research Network
    @Column('smallint', { nullable: false, default: 0 })
    gravitonTechnology: number = 0;
    //Drives
    @Column('smallint', { nullable: false, default: 0 })
    combustionDrive: number = 0;
    @Column('smallint', { nullable: false, default: 0 })
    impulseDrive: number = 0;
    @Column('smallint', { nullable: false, default: 0 })
    hyperspaceDrive: number = 0;
    //Combat
    @Column('smallint', { nullable: false, default: 0 })
    weaponTechnology: number;
    @Column('smallint', { nullable: false, default: 0 })
    shieldingTechnology: number;
    @Column('smallint', { nullable: false, default: 0 })
    armourTechnology: number;

    public getResearchList() {
        return [
            { key: "energyTechnology", level: this.energyTechnology },
            { key: "laserTechnology", level: this.laserTechnology },
            { key: "ionTechnology", level: this.ionTechnology },
            { key: "hyperspaceTechnology", level: this.hyperspaceTechnology },
            { key: "plasmaTechnology", level: this.plasmaTechnology },
            { key: "espionageTechnology", level: this.espionageTechnology },
            { key: "computerTechnology", level: this.computerTechnology },
            { key: "astrophysics", level: this.astrophysics },
            { key: "network", level: this.network },
            { key: "gravitonTechnology", level: this.gravitonTechnology },
            { key: "combustionDrive", level: this.combustionDrive },
            { key: "impulseDrive", level: this.impulseDrive },
            { key: "hyperspaceDrive", level: this.hyperspaceDrive },
            { key: "weaponTechnology", level: this.weaponTechnology },
            { key: "shieldingTechnology", level: this.shieldingTechnology },
            { key: "armourTechnology", level: this.armourTechnology }
        ]
    }
}

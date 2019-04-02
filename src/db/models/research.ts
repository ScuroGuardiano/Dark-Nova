import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class Research extends BaseEntity {
    [Key: string]: any;
    @PrimaryGeneratedColumn('increment')
    public id: number;
    //Basic
    @Column('smallint', { nullable: false, default: 0 })
    public energyTechnology = 0;
    @Column('smallint', { nullable: false, default: 0 })
    public laserTechnology = 0;
    @Column('smallint', { nullable: false, default: 0 })
    public ionTechnology = 0;
    @Column('smallint', { nullable: false, default: 0 })
    public hyperspaceTechnology = 0;
    @Column('smallint', { nullable: false, default: 0 })
    public plasmaTechnology = 0;
    //Advanced
    @Column('smallint', { nullable: false, default: 0 })
    public espionageTechnology = 0;
    @Column('smallint', { nullable: false, default: 0 })
    public computerTechnology = 0;
    @Column('smallint', { nullable: false, default: 0 })
    public astrophysics = 0;
    @Column('smallint', { nullable: false, default: 0 })
    public network = 0; //Intergalactic Research Network
    @Column('smallint', { nullable: false, default: 0 })
    public gravitonTechnology = 0;
    //Drives
    @Column('smallint', { nullable: false, default: 0 })
    public combustionDrive = 0;
    @Column('smallint', { nullable: false, default: 0 })
    public impulseDrive = 0;
    @Column('smallint', { nullable: false, default: 0 })
    public hyperspaceDrive = 0;
    //Combat
    @Column('smallint', { nullable: false, default: 0 })
    public weaponTechnology: number;
    @Column('smallint', { nullable: false, default: 0 })
    public shieldingTechnology: number;
    @Column('smallint', { nullable: false, default: 0 })
    public armourTechnology: number;

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
        ];
    }
}

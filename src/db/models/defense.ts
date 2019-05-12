import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class Defense {
    [key: string]: any;
    @PrimaryGeneratedColumn('increment')
    public id: number;
    @Column('bigint', { default: 0, nullable: false })
    public rocketLauncher = 0;
    @Column('bigint', { default: 0, nullable: false })
    public lightLaser = 0;
    @Column('bigint', { default: 0, nullable: false })
    public heavyLaser = 0;
    @Column('bigint', { default: 0, nullable: false })
    public ionCannon = 0;
    @Column('bigint', { default: 0, nullable: false })
    public gaussCannon = 0;
    @Column('bigint', { default: 0, nullable: false })
    public plasmaTurret = 0;
    @Column('bigint', { default: 0, nullable: false })
    public smallShieldDome = 0;
    @Column('bigint', { default: 0, nullable: false })
    public largeShieldDome = 0;
    @Column('bigint', { default: 0, nullable: false })
    public antiMissile = 0;
    @Column('bigint', { default: 0, nullable: false })
    public missile = 0;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Ships {
    @PrimaryGeneratedColumn()
    public id: number;
    @Column('bigint', { default: 0, nullable: false })
    public smallCargo = 0;
    @Column('bigint', { default: 0, nullable: false })
    public largeCargo = 0;
    @Column('bigint', { default: 0, nullable: false })
    public lightFighter = 0;
    @Column('bigint', { default: 0, nullable: false })
    public heavyFighter = 0;
    @Column('bigint', { default: 0, nullable: false })
    public cruiser = 0;
    @Column('bigint', { default: 0, nullable: false })
    public battleship = 0;
    @Column('bigint', { default: 0, nullable: false })
    public battlecruiser = 0;
    @Column('bigint', { default: 0, nullable: false })
    public destroyer = 0;
    @Column('bigint', { default: 0, nullable: false })
    public deathstar = 0;
    @Column('bigint', { default: 0, nullable: false })
    public bomber = 0;
    @Column('bigint', { default: 0, nullable: false })
    public recycler = 0;
    @Column('bigint', { default: 0, nullable: false })
    public espionageProbe = 0;
    @Column('bigint', { default: 0, nullable: false })
    public solarSatellite = 0;
    @Column('bigint', { default: 0, nullable: false })
    public colonyShip = 0;
}

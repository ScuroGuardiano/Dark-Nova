/*
Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import User from './user';
import Research from './research';


export enum Permissions {
    GOD = "god",
    ADMIN = "admin",
    GAME_MASTER = "gameMaster",
    MODERATOR = "moderator",
    USER = "user"
}
@Entity()
export default class Player extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({ nullable: false })
    public nickname: string;

    /** Lowercase nickname without spaces */
    @Column({ nullable: false })
    public nicknameLowcase: string;

    @Column({ default: Permissions.USER })
    public permissions: Permissions;

    /** If not banned, then it is set to null */
    @Column({ nullable: true })
    public bannedUntil: Date;

    /** If not banned, then it is set to null */
    @Column({ nullable: true })
    public banReason: string;

    @Column({ nullable: false })
    public userId: string;

    @OneToOne(type => Research, {
        cascade: true,
        eager: true
    })
    @JoinColumn()
    public research: Research;

    @OneToOne(type => User)
    @JoinColumn()
    public user: User;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
    private constructor() {
        super();
    }
    public static createNew(userId: string, nickname: string): Player {
        const player = new Player();
        player.userId = userId;
        player.nickname = nickname;
        player.nicknameLowcase = nickname.split(' ').join('').toLowerCase();
        player.research = new Research();
        return player;
    }
    public static async findByNickname(nickname: string) {
        const nicknameLowcase = nickname.split(' ').join('').toLowerCase();
        return this.findOne({ where: { nicknameLowcase: nicknameLowcase }});
    }
}

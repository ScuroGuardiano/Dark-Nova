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
    private constructor() {
        super();
    }
    public static createNew(userId: string, nickname: string): Player {
        let player = new Player();
        player.userId = userId;
        player.nickname = nickname;
        player.nicknameLowcase = nickname.split(' ').join('').toLowerCase();
        player.research = new Research();
        return player;
    }
    public static findByNickname(nickname: string) {
        let nicknameLowcase = nickname.split(' ').join('').toLowerCase();
        return this.findOne({ where: { nicknameLowcase: nicknameLowcase }});
    }
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ nullable: false })
    nickname: string;

    /** Lowercase nickname without spaces */
    @Column({ nullable: false })
    nicknameLowcase: string;

    @Column({ default: Permissions.USER })
    permissions: Permissions;

    /** If not banned, then it is set to null */
    @Column({ nullable: true })
    bannedUntil: Date;

    /** If not banned, then it is set to null */
    @Column({ nullable: true })
    banReason: string;

    @Column({ nullable: false })
    userId: string;

    @OneToOne(type => Research, {
        cascade: true,
        eager: true
    })
    @JoinColumn()
    research: Research;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

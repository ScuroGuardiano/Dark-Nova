/*
Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, Index, ManyToOne, JoinColumn, OneToOne, AfterLoad } from 'typeorm';
import Player from './player';
import IMessageData from '../../game/data-types/message-data';

@Entity()
export default class Message extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    public id: number;
    @Column()
    public senderName: string;
    @ManyToOne(type => Player)
    public sender?: Player;
    @ManyToOne(type => Player)
    public receiver: Player;
    @Column()
    public senderId?: number;
    @Column({ nullable: false })
    public receiverId: number;
    @Column({ nullable: false, type: "tinyint" })
    public type: number;
    @Column({ default: "No subject" })
    public subject: string;
    @Column('text', { nullable: false })
    public content: string;
    @CreateDateColumn()
    public createdAt: Date;
    @Column({ default: false })
    public read: boolean;
    public static createNew(messageData: IMessageData) {
        const message = new Message();
        message.subject = messageData.subject || "No subject";
        message.content = messageData.content;
        message.type = messageData.type;
        message.receiverId = messageData.receiverId;
        message.senderId = messageData.senderId || null;
        message.senderName = messageData.senderName;
        return message;
    }
}

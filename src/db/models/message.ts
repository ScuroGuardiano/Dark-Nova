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
    public static createNew(messageData: IMessageData) {
        let message = new Message();
        message.subject = messageData.subject || "No subject";
        message.content = messageData.content;
        message.type = messageData.type;
        message.receiverId = messageData.receiverId;
        message.senderId = messageData.senderId || null;
        message.senderName = messageData.senderName;
        return message;
    }

    @PrimaryGeneratedColumn('increment')
    id: number;
    @Column()
    senderName: string;
    @ManyToOne(type => Player)
    sender?: Player;
    @ManyToOne(type => Player)
    receiver: Player;
    @Column()
    senderId?: number;
    @Column({ nullable: false })
    receiverId: number;
    @Column({ nullable: false, type: "tinyint" })
    type: number;
    @Column({ default: "No subject" })
    subject: string;
    @Column('text', { nullable: false })
    content: string;
    @CreateDateColumn()
    createdAt: Date;
    @Column({ default: false })
    read: boolean
}

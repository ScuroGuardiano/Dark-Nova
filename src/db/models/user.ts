/*
Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import * as Sequelize from 'sequelize';

export interface IUserAttributes {
    id?: string;
    email: string;
    password: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface IUserInstance extends IUserAttributes, Sequelize.Instance<IUserAttributes> {}

export default function defineUserModel(sequelize: Sequelize.Sequelize) {
    return sequelize.define<IUserInstance, IUserAttributes>('User', {
        id: { type: Sequelize.UUID, primaryKey: true, unique: true, defaultValue: Sequelize.UUIDV4 },
        email: { type: Sequelize.STRING, unique: true, allowNull: false },
        password: { type: Sequelize.STRING, allowNull: false }
    }, { version: true });
}

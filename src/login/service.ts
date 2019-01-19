/*
8888888b.                   888           888b    888
888  "Y88b                  888           8888b   888
888    888                  888           88888b  888
888    888  8888b.  888d888 888  888      888Y88b 888  .d88b.  888  888  8888b.
888    888     "88b 888P"   888 .88P      888 Y88b888 d88""88b 888  888     "88b
888    888 .d888888 888     888888K       888  Y88888 888  888 Y88  88P .d888888
888  .d88P 888  888 888     888 "88b      888   Y8888 Y88..88P  Y8bd8P  888  888
8888888P"  "Y888888 888     888  888      888    Y888  "Y88P"    Y88P   "Y888888

Copyright (C) 2019 - ScuroGuardiano

This file is part of Dark Nova project.
This file and project is licensed under the MIT license
See file LICENSE in the root of this project or go to <https://opensource.org/licenses/MIT> for full license details.
*/

import BasicError from "../errors/basic-error";
import { User } from "../db/index";
import * as bcrypt from 'bcrypt';
import UknownError from "../errors/unknown";

export namespace Errors {
    //Login errors
    export class WrongEmailOrPassword extends BasicError {
        constructor() {
            super("Wrong username or password");
        }
    }
    //Register errors
    export class InvalidPasswordFormat extends BasicError {
        constructor() {
            super("Invalid password format");
        }
    }
    export class AccountAlreadyExists extends BasicError {
        constructor() {
            super("Account already exists");
        }
    }
    export class InvalidEmailFormat extends BasicError {
        constructor() {
            super("Invalid email format");
        }
    }
    //Database
    export class UknownDatabaseError extends BasicError {
        constructor() {
            super("Uknown database error");
        }
    }
}

export default class UserService {
    /**
     * Registers user, returns user 
     * @param email 
     * @param password 
     */
    public async registerUser(email: string, password: string) {
        if(!this.verifyEmail(email))
            throw new Errors.InvalidEmailFormat();
        if(!this.checkPassword(password))
            throw new Errors.InvalidPasswordFormat();
        if(await this.getUserByEmail(email) !== null)
            throw new Errors.AccountAlreadyExists();
        
        let hashedPassword = await bcrypt.hash(password, 12);

        let user = await User.create({
            email: email,
            password: hashedPassword
        });
        if(user)
            return user;
        throw new UknownError();
    }
    public async authUser(email: string, password: string) {
        let user = await this.getUserByEmail(email);
        if(!user)
            throw new Errors.WrongEmailOrPassword();
        if(await bcrypt.compare(password, user.password))
            return user;
        else
            throw new Errors.WrongEmailOrPassword();
    }
    private verifyEmail(email: string) {
        return this.emailRegex.test(email);
    }
    private checkPassword(password: string) {
        return password.length >= 8;
    }
    private async getUserByEmail(email: string) {
        return await User.findOne({ where: { email: email }}) || null;
    }
    private emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
}

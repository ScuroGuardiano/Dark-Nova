import BasicError from "../../errors/basic-error";
import Player from "../../db/models/player";

export namespace Errors {
    export class InvalidNickname extends BasicError {
        constructor(nickname?: string) {
            super(`Nickname ${nickname ? nickname + " " : ""} is invalid.`);
        }
    }
    export class UserAlreadyGotPlayer extends BasicError {
        constructor() {
            super(`User already have got player!`);
        }
    }
    export class NicknameIsInUse extends BasicError {
        constructor(nickname?: string) {
            super(`Nickname ${nickname ? nickname + " " : ""} is in use.`);
        }
    }
}

export default class PlayerService {
    /** Allow only one space between words for nickname */
    private readonly nicknameRegex = /^([a-zA-Z0-9]+\s){0,1}[a-zA-Z0-9]+$/;
    /** Matches word: admin, mod, gm, gamemaster, game master*/
    private readonly unallowedVerbs = /\b(\w*[aA4][dD][mM][iI1l][nN]\w*)|(\w*[mM][oO0][dD]\w*)|(\w*[gG][mM]\w*)|(\w*[gG][aA][mM][eE]\s*[mM][aA4][sS5][tT][eE3][rR]\w*)\b/;

    public async createNewPlayer(userId: string, nickname: string) {
        nickname = nickname.trim();
        await this.checkIfPlayerCanBeCreated(userId, nickname);

        const player = Player.createNew(userId, nickname);
        await player.save();
        return player;
    }
    private async isUserGotPlayer(userId: string): Promise<boolean> {
        const players = await Player.count({ where: { userId: userId }});
        if(players > 0) return true;
        return false;
    }
    private async isPlayerExists(nickname: string): Promise<boolean> {
        const player = await Player.findByNickname(nickname);
        if(player)
            return true;
        return false;
    }
    private async checkIfPlayerCanBeCreated(userId: string, nickname: string) {
        if (await this.isUserGotPlayer(userId))
            throw new Errors.UserAlreadyGotPlayer();
        if (!this.validateNickname(nickname))
            throw new Errors.InvalidNickname(nickname);
        if (await this.isPlayerExists(nickname))
            throw new Errors.NicknameIsInUse(nickname);
    }
    private validateNickname(nickname: string): boolean {
        if(nickname.length < 4 || nickname.length > 16)
            return false;
        return this.nicknameRegex.test(nickname) && !this.unallowedVerbs.test(nickname);
    }
}

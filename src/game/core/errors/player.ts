import BasicError from "../../../errors/basic-error";

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

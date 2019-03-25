export interface ICoordinates {
    galaxy: number;
    system: number;
    position: number;
}

export class Coordinates implements ICoordinates {
    public constructor(public galaxy: number, public system: number, public position: number) {}
    public toString(): string {
        return `${this.galaxy}:${this.system}:${this.position}`;
    }
}

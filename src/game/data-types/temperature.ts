export interface ITemperature {
    min: number;
    max: number;
}
export class Temperature {
    public constructor(public min: number, public max: number) {}
    public toString(): string {
        return `TMin: ${this.min}, TMax: ${this.max}`;
    }
}

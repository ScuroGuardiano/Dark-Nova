export interface IResources {
    metal: number;
    crystal: number;
    deuter: number;
}
export interface IResourcesAndEnergy extends IResources {
    energy: number;
}
export class Resources implements IResources {
    public constructor(public metal: number, public crystal: number, public deuter: number) {}
    public toString() {
        return `Metal: ${this.metal}, Crystal: ${this.crystal}, Deuter: ${this.deuter}`;
    }
}
export class ResourcesAndEnergy extends Resources implements IResourcesAndEnergy {
    public constructor(metal: number, crystal: number, deuter: number, public energy: number) {
        super(metal, crystal, deuter);
    }
    public toString() {
        return `${super.toString()}, Energy: ${this.energy}`;
    }
}
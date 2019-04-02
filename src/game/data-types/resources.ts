export interface IResources {
    metal: number;
    crystal: number;
    deuter: number;
}
export interface IResourcesAndEnergy extends IResources {
    energy: number;
}
export class Resources implements IResources {
    public constructor(public metal = 0, public crystal = 0, public deuter = 0) {}
    public toString() {
        return `Metal: ${this.metal}, Crystal: ${this.crystal}, Deuter: ${this.deuter}`;
    }
    public multiplyBy(x: number): Resources {
        this.metal *= x;
        this.crystal *= x;
        this.deuter *= x;
        return this;
    }
    /**
     * Performs Math.floor on every resource
     */
    public floor() {
        this.metal = Math.floor(this.metal);
        this.crystal = Math.floor(this.crystal);
        this.deuter = Math.floor(this.deuter);
        return this;
    }
    public round() {
        this.metal = Math.round(this.metal);
        this.crystal = Math.round(this.crystal);
        this.deuter = Math.round(this.deuter);
        return this;
    }
}
export class ResourcesAndEnergy extends Resources implements IResourcesAndEnergy {
    public constructor(metal = 0, crystal = 0, deuter = 0, public energy = 0) {
        super(metal, crystal, deuter);
    }
    public toString() {
        return `${super.toString()}, Energy: ${this.energy}`;
    }
    public multiplyBy(x: number): ResourcesAndEnergy {
        super.multiplyBy(x);
        this.energy *= x;
        return this;
    }
    public floor() {
        super.floor();
        this.energy = Math.floor(this.energy);
        return this;
    }
    public round() {
        super.round();
        this.energy = Math.round(this.energy);
        return this;
    }
}
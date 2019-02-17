export interface IResources {
    metal: number;
    crystal: number;
    deuter: number;
}
export interface IResourcesAndEnergy extends IResources {
    energy: number;
}
export class Resources implements IResources {
    public constructor(public metal: number = 0, public crystal: number = 0, public deuter: number = 0) {}
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
}
export class ResourcesAndEnergy extends Resources implements IResourcesAndEnergy {
    public constructor(metal: number = 0, crystal: number = 0, deuter: number = 0, public energy: number = 0) {
        super(metal, crystal, deuter);
    }
    public toString() {
        return `${super.toString()}, Energy: ${this.energy}`;
    }
    public multiplyBy(x: number): ResourcesAndEnergy {
        this.multiplyBy(x);
        this.energy *= x;
        return this;
    }
    public floor() {
        super.floor();
        this.energy = Math.floor(this.energy);
        return this;
    }
}
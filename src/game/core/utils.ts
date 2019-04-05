import { IResourcesAndEnergy, IResources } from "../data-types/resources";

export function haveEnoughResources(resources: IResourcesAndEnergy, required: IResourcesAndEnergy): boolean {
    return resources.metal >= required.metal &&
        resources.crystal >= required.crystal &&
        resources.deuter >= required.deuter &&
        resources.energy >= required.energy;
}
export function addResources(x: IResources, y: IResources): IResources {
    return {
        metal: x.metal + y.metal,
        crystal: x.crystal + y.crystal,
        deuter: x.deuter + y.deuter
    };
}
export function subtractResources(from: IResources, subtrahend: IResources): IResources {
    from.metal -= subtrahend.metal;
    from.crystal -= subtrahend.crystal;
    from.deuter -= subtrahend.deuter;
    return from;
}

import Planet from "../../db/models/planet";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

export default class Updater {
    public constructor(private planet: Planet) {}
    public update() {
        this.now = Date.now();
        this.timeSinceLastUpdate = this.now - this.planet.lastUpdate.getTime();
        if(this.timeSinceLastUpdate <= 0)
            return this.planet;
        this.hoursSinceLastUpdate = this.timeSinceLastUpdate / HOUR;

        this.updateResources();
        this.planet.lastUpdate = new Date(this.now);
        return this.planet;
    }
    private updateResources() {
        this.planet.metal += this.planet.metalPerHour * this.hoursSinceLastUpdate;
        this.planet.crystal += this.planet.crystalPerHour * this.hoursSinceLastUpdate;
        this.planet.deuter += this.planet.deuteriumPerHour * this.hoursSinceLastUpdate;

        if(this.planet.metal > this.planet.metalStorage)
            this.planet.metal = this.planet.metalStorage;
        if (this.planet.crystal > this.planet.crystalStorage)
            this.planet.crystal = this.planet.crystalStorage;
        if (this.planet.deuter > this.planet.deuteriumStorage)
            this.planet.deuter = this.planet.deuteriumStorage;
    }
    private now: number;
    private timeSinceLastUpdate: number;
    private hoursSinceLastUpdate: number;
}
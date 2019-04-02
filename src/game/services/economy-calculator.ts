import Planet from "../../db/models/planet";
import uniConfig from "../../config/uni-config";
import IEnergyUsage from "../data-types/energy-usage";
import { Resources } from "../data-types/resources";
import IEconomyData from "../data-types/economy-data";

export default class EconomyCalculator {
    constructor(private readonly planet: Planet) {}
    //TODO: Economy settings
    public calculateEconomy(): IEconomyData {
        const energy = this.energyProduction();
        const usedEnergy = this.energyUsage();
        let efficiency = energy / usedEnergy.total;
        const baseProductions = uniConfig.get('baseProductions');

        if(!isFinite(efficiency)) efficiency = 0;
        else if(efficiency > 1.0) efficiency = 1.0;

        const production = this.buildingsProduction(usedEnergy);
        production.multiplyBy(efficiency);
        production.metal += baseProductions.metal;
        production.crystal += baseProductions.crystal;
        production.deuter += baseProductions.deuter;

        return {
            energy: {
                production: energy,
                usage: usedEnergy.total,
                usageCoverage: efficiency,
                metalMineUsage: usedEnergy.metalMine * efficiency,
                crystalMineUsage: usedEnergy.crystalMine * efficiency,
                deuteriumSynthesizerUsage: usedEnergy.deuteriumSynthesizer * efficiency
            },
            production: {
                metal: production.metal,
                crystal: production.crystal,
                deuter: production.deuter
            },
            efficiency: {
                metalMine: efficiency,
                crystalMine: efficiency,
                deuterMine: efficiency
            }
        };
    }
    private energyProduction() {
        return Math.floor(20 * this.planet.buildings.solarPlant * Math.pow(1.1, this.planet.buildings.solarPlant))
            + uniConfig.get('baseProductions').energy;
    }
    private energyUsage() {
        const metalMineLevel = this.planet.buildings.metalMine;
        const crystalMineLevel = this.planet.buildings.crystalMine;
        const deuteriumSynthesizerLevel = this.planet.buildings.deuteriumSynthesizer;

        const metalMineUsage = Math.floor(10 * metalMineLevel * Math.pow(1.1, metalMineLevel));
        const crystalMineUsage = Math.floor(10 * crystalMineLevel * Math.pow(1.1, crystalMineLevel));
        const deuteriumSynthesizerUsage = Math.floor(20 * deuteriumSynthesizerLevel * Math.pow(1.1, deuteriumSynthesizerLevel));

        return {
            total: metalMineUsage + crystalMineUsage + deuteriumSynthesizerUsage,
            metalMine: metalMineUsage,
            crystalMine: crystalMineUsage,
            deuteriumSynthesizer: deuteriumSynthesizerUsage
        };
    }
    private buildingsProduction(usedEnergy: IEnergyUsage) {
        const metalMineLevel = this.planet.buildings.metalMine;
        const crystalMineLevel = this.planet.buildings.crystalMine;
        const economySpeed = uniConfig.get('speed').production;
        const TAvg = (this.planet.maxTemperature + this.planet.minTemperature) / 2;

        return new Resources(
            30 * economySpeed * metalMineLevel * Math.pow(1.1, metalMineLevel),
            20 * economySpeed * crystalMineLevel * Math.pow(1.1, crystalMineLevel),
            economySpeed * usedEnergy.deuteriumSynthesizer * (0.68 - 0.002 * TAvg)
        );
    }
}
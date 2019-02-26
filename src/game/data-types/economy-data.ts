export default interface IEconomyData {
    energy: {
        production: number;
        usage: number;
        usageCoverage: number;
        metalMineUsage: number;
        crystalMineUsage: number;
        deuteriumSynthesizerUsage: number;
    }
    production: {
        metal: number;
        crystal: number;
        deuter: number;
    }
    efficiency: {
        metalMine: number;
        crystalMine: number;
        deuterMine: number;
        //TODO: fusionReactor: number;
    }
}

import PlayerService from "./player";
import HomePlanetService from "./home-planet";
import PlanetService from "./planet";

const playerService = new PlayerService();
const homePlanetService = new HomePlanetService();
const planetService = new PlanetService(homePlanetService);

export { playerService };
export { planetService };
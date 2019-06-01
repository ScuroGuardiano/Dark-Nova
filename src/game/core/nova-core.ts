import Planet from "@db/models/planet";
import Player from "@db/models/player";
import PlayerNotFound from "./errors/player-not-found";
import PlanetService from "./services/planet";
import PlayerService from "./services/player";
import Updater from "./services/updating/updater";
import BuildingService from "./services/building";
import ResearchService from "./services/research";
import PlanetDoesNotBelongToPlayer from "./errors/planet-not-belong-to-player";

/**
 * NovaCore controls whole game logic by using various services  
 * The main purpose for this class is make operating on data much easier.  
 * Example usage in view:
 * 
 *     const core = new NovaCore(userId);
 *     await core.init();
 *     const buildQueue = await core.building.getBuildQueue();
 *     const missions = await core.fleeting.getMissions();
 *     const messages = await core.messaging.count();
 *     
 *     render('overview', {
 *         player: core.player,
 *         planet: core.planet,
 *         buildQueue, missions, messages
 *     });
 */
export default class NovaCore {
    private planet: Planet;
    private player: Player;
    private _buildingService: BuildingService;
    private _researchService: ResearchService;
    private _planetService: PlanetService;
    private _playerService: PlayerService;
    private _initialized = false;

    public get $planet() {
        return this.planet;
    }
    public get $player() {
        return this.player;
    }
    public get initialized() {
        return this._initialized;
    }
    public get planetService() {
        return this._planetService ? this._planetService : this._planetService = new PlanetService();
    }
    public get playerService() {
        return this._playerService ? this._playerService : this._playerService = new PlayerService();
    }
    public get building() {
        return this._buildingService ? this._buildingService : this._buildingService = new BuildingService(this.player, this.planet);
    }
    public get researching() {
        return this._researchService ?
            this._researchService
            : this._researchService = new ResearchService(this.player, this.planet);
    }

    public constructor(private readonly userId: string) {}
    public async init(planetId?: number): Promise<void> {
        if(this._initialized) return; //Already initialized

        this.player = await Player.findOne({ userId: this.userId });
        if(!this.player) {
            throw new PlayerNotFound();
        }
        if(planetId) {
            const planet = await Planet.findOne({ where: {
                id: planetId,
                playerId: this.player.id
            }});
            if(planet) {
                //Planet does belong to player, we can assign it to this.planet, in other case default planet will be loaded
                this.planet = planet;
            }
            else {
                throw new PlanetDoesNotBelongToPlayer(planetId, this.player.id);
            }
        }
        else {
            const planet = await this.planetService.getFirstPlayerPlanet(this.player.id);
            if(planet) this.planet = planet;
            else {
                //Planet does not exists, need to create new home planet
                this.planet = await this.planetService.createNewPlanet(this.player.id, null, true);
                this._initialized = true;
                return; //Here we can finish, we don't have to update new planet
            }
        }
        //Now just update
        const updater = new Updater(this.planet.id);
        const { player, planet } = await updater.fullUpdatePlanet();
        this.player = player;
        this.planet = planet;
        this._initialized = true;
    }
    public async createNewPlayer(nickname: string) {
        return this.playerService.createNewPlayer(this.userId, nickname);
    }
}

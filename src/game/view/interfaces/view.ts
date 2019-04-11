import Player from "@db/models/player";
import Planet from "@db/models/planet";

export default interface IView {
    player: Player;
    planet: Planet;
}

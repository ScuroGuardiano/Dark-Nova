import IBuildingInfo from "../buildings-info";
import BuildTask from "@db/models/build-task";
import IView from "../view";

export default interface IBuildingsPage extends IView {
    buildings: IBuildingInfo[];
    buildQueue: BuildTask[];
}

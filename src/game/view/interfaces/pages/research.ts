import IResearchInfo from "../research-info";
import IView from "../view";
import ResearchTask from "@db/models/research-task";

export default interface IResearchPage extends IView {
    technologies: IResearchInfo[];
    researchQueue: ResearchTask[];
}

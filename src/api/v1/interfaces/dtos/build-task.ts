export default interface IBuildTask {
    taskId: number;
    buildingKey: string;
    taskType: "construction" | "destruction";
    startTime: number;
    finishTime: number;
}

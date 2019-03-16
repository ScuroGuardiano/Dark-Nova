import ITask from "./task";
import { EntityManager } from "typeorm";

export default interface ITaskQueue<T extends ITask = ITask> {
    load(entityManager: EntityManager): Promise<ITaskQueue>;
    save(entityManager: EntityManager): Promise<ITaskQueue>;
    front(): T;
    back(): T;
    isEmpty(): boolean;
    isFull(): boolean;
    length(): number;
    push(task: T): void;
    pop(): T;
}

import ITask from "./task";
import { EntityManager } from "typeorm";

export default interface ITaskQueue<T extends ITask> {
    load(entityManager: EntityManager): Promise<boolean>;
    save(entityManager: EntityManager): Promise<boolean>;
    front(): T;
    back(): T;
    isEmpty(): boolean;
    isFull(): boolean;
    length(): number;
    push(task: T): void;
    pop(): T;
}

import ITask from "../interfaces/task";
import ITaskQueue from "../interfaces/task-queue";
import { EntityManager } from "typeorm";

export default abstract class BaseTaskQueue<T extends ITask = ITask> implements ITaskQueue<T> {
    constructor(maxSize = 1) {
        this.elements = [];
        this.removed = [];
        this.maxSize = maxSize;
    }
    public async abstract load(entityManager: EntityManager): Promise<BaseTaskQueue>;
    public async abstract save(entityManager: EntityManager): Promise<BaseTaskQueue>;
    public front(): T {
        return this.elements[0];
    }
    public back(): T {
        return this.elements[this.elements.length - 1];
    }
    public isEmpty(): boolean {
        return this.elements.length === 0;
    }
    public isFull(): boolean {
        return this.elements.length >= this.maxSize;
    }
    public length(): number {
        return this.elements.length;
    }
    public push(task: T): void {
        this.elements.push(task);
    }
    public pop(): T {
        let task = this.elements.shift();
        this.removed.push(task);
        return task;
    }
    public toArray() {
        return [...this.elements];
    }

    protected elements: Array<T>;
    //To removed popped task from DB.
    protected removed: Array<T>;
    protected maxSize: number;
}

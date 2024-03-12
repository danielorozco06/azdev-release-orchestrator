import { TaskResult, TimelineRecordState } from "azure-devops-node-api/interfaces/BuildInterfaces";

/**
 * Interface representing an individual task within a build stage.
 */
export interface IBuildTask {
    /**
     * The unique identifier for the build task.
     */
    id: string;

    /**
     * The name of the build task.
     */
    name: string;

    /**
     * The start time of the build task. It can be null if the task has not started yet.
     */
    startTime: Date | null;

    /**
     * The finish time of the build task. It can be null if the task has not finished yet.
     */
    finishTime: Date | null;

    /**
     * The current state of the build task, which can be null if the state is not determined.
     */
    state: TimelineRecordState | null;

    /**
     * The result of the build task execution as defined by TaskResult.
     */
    result: TaskResult;
}

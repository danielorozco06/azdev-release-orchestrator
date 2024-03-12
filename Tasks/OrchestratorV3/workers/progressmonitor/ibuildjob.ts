import { TaskResult, TimelineRecordState } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IBuildTask } from "./ibuildtask";

/**
 * Interface representing a job within a build process.
 */
export interface IBuildJob {
    /**
     * The unique identifier for the build job.
     */
    id: string;

    /**
     * The name of the build job.
     */
    name: string;

    /**
     * The name of the worker executing the build job.
     */
    workerName: string;

    /**
     * The start time of the build job. It can be null if the job has not started yet.
     */
    startTime: Date | null;

    /**
     * The finish time of the build job. It can be null if the job has not finished yet.
     */
    finishTime: Date | null;

    /**
     * The current state of the build job as defined by the TimelineRecordState.
     */
    state: TimelineRecordState;

    /**
     * The result of the build job. It can be null if the result is not yet available or applicable.
     */
    result: TaskResult | null;

    /**
     * An array of tasks that are part of the build job.
     */
    tasks: IBuildTask[];
}

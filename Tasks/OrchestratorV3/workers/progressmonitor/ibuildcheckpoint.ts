import { TaskResult, TimelineRecordState } from "azure-devops-node-api/interfaces/BuildInterfaces";

/**
 * Interface representing a checkpoint in a build process.
 */
export interface IBuildCheckpoint {
    /**
     * The unique identifier for the build checkpoint.
     */
    id: string;

    /**
     * The current state of the build checkpoint as defined by the TimelineRecordState.
     */
    state: TimelineRecordState;

    /**
     * The result of the build at this checkpoint. It can be null if the result is not yet available or applicable.
     */
    result: TaskResult | null;
}

import { TaskResult, TimelineRecordState } from "azure-devops-node-api/interfaces/BuildInterfaces";

/**
 * Interface representing the check details of a build.
 */
export interface IBuildCheck {
    /**
     * The unique identifier for the build check.
     */
    id: string;

    /**
     * The state of the timeline record for the build check.
     */
    state: TimelineRecordState;

    /**
     * The result of the task associated with the build check.
     * This can be null if the result is not determined yet.
     */
    result: TaskResult | null;
}

import { TaskResult, TimelineRecordState } from "azure-devops-node-api/interfaces/BuildInterfaces";

/**
 * Interface representing the approval details of a build.
 */
export interface IBuildApproval {
    /**
     * The unique identifier for the build approval.
     */
    id: string;

    /**
     * The state of the timeline record for the build approval.
     */
    state: TimelineRecordState;

    /**
     * The result of the task associated with the build approval.
     * This can be null if the result is not determined yet.
     */
    result: TaskResult | null;
}

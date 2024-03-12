import { TaskResult, TimelineRecordState } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IBuildApproval } from "./ibuildapproval";
import { IBuildCheck } from "./ibuildcheck";
import { IBuildCheckpoint } from "./ibuildcheckpoint";
import { IBuildJob } from "./ibuildjob";

/**
 * Interface representing a stage within a build pipeline.
 */
export interface IBuildStage {
    /**
     * The unique identifier for the build stage.
     */
    id: string;

    /**
     * The name of the build stage.
     */
    name: string;

    /**
     * The start time of the build stage. It can be null if the stage has not started yet.
     */
    startTime: Date | null;

    /**
     * The finish time of the build stage. It can be null if the stage has not finished yet.
     */
    finishTime: Date | null;

    /**
     * The current state of the build stage as defined by the TimelineRecordState.
     */
    state: TimelineRecordState;

    /**
     * The result of the build stage. It can be null if the result is not yet available or applicable.
     */
    result: TaskResult | null;

    /**
     * The checkpoint information for the build stage, if any.
     */
    checkpoint: IBuildCheckpoint | null;

    /**
     * An array of approvals associated with the build stage.
     */
    approvals: IBuildApproval[];

    /**
     * An array of checks associated with the build stage.
     */
    checks: IBuildCheck[];

    /**
     * An array of jobs that are part of the build stage.
     */
    jobs: IBuildJob[];

    /**
     * An object containing attempt numbers for the stage, approval, and check.
     */
    attempt: {
        /**
         * The attempt number for the stage.
         */
        stage: number;

        /**
         * The attempt number for the approval process.
         */
        approval: number;

        /**
         * The attempt number for the check process.
         */
        check: number;
    };
}

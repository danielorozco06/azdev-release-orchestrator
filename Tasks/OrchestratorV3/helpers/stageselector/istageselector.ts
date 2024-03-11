import { Build } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IBuildApproval } from "../../workers/progressmonitor/ibuildapproval";
import { IBuildStage } from "../../workers/progressmonitor/ibuildstage";

/**
 * Class responsible for selecting and managing stages in Azure DevOps builds.
 */
export interface IStageSelector {
    /**
     * Retrieves the details of a specific stage within a build.
     * @param build - The build containing the stage.
     * @param stage - The stage to retrieve.
     * @returns A promise that resolves to the updated `IBuildStage` object.
     * @throws Will throw an error if the timeline or stage timeline cannot be retrieved.
     */
    getStage(build: Build, stage: IBuildStage): Promise<IBuildStage>;

    /**
     * Initiates the start of a stage within a build.
     * @param build - The build containing the stage to start.
     * @param stage - The stage to start.
     * @returns A promise that resolves when the stage has been started.
     */
    startStage(build: Build, stage: IBuildStage): Promise<void>;

    /**
     * Approves a stage within a build.
     * @param build - The build containing the stage to approve.
     * @param approval - The approval details for the stage.
     * @param comment - An optional comment for the approval.
     * @returns A promise that resolves to the result of the approval request.
     */
    approveStage(build: Build, approval: IBuildApproval, comment?: string): Promise<unknown>;

    /**
     * Confirms that a stage within a build has started successfully.
     * @param build - The build containing the stage to confirm.
     * @param stage - The stage to confirm.
     * @param maxAttempts - The maximum number of attempts to check if the stage has started.
     * @param interval - The interval in milliseconds between each attempt.
     * @returns A promise that resolves to the updated `IBuildStage` object.
     * @throws Will throw an error if the stage does not start within the specified attempts or if the stage is skipped or pending dependencies.
     */
    confirmStage(build: Build, stage: IBuildStage, maxAttempts: number, interval: number): Promise<IBuildStage>;

}

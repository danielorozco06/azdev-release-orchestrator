import { Build } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { ISettings } from "../../helpers/taskhelper/isettings";
import { IBuildStage } from "../progressmonitor/ibuildstage";

/**
 * Interface for stage approver.
 */
export interface IStageApprover {
    /**
     * Approves a given stage if it has pending approvals.
     * @param stage - The stage to approve.
     * @param build - The build that contains the stage.
     * @param settings - Settings containing approval configuration.
     * @param comment - Optional comment for the approval.
     * @returns A promise that resolves with the updated stage after approval attempts.
     */
    approve(stage: IBuildStage, build: Build, settings: ISettings, comment?: string): Promise<IBuildStage>;

    /**
     * Checks if a given stage has any pending checks and handles them accordingly.
     * @param stage - The stage to check.
     * @param build - The build that contains the stage.
     * @param settings - Settings containing check configuration.
     * @returns A promise that resolves with the updated stage after check attempts.
     */
    check(stage: IBuildStage, build: Build, settings: ISettings): Promise<IBuildStage>;

    /**
     * Determines if there are any pending approvals for a stage.
     * @param stage - The stage to evaluate for pending approvals.
     * @returns True if there are pending approvals, false otherwise.
     */
    isApprovalPending(stage: IBuildStage): boolean;

    /**
     * Determines if there are any pending checks for a stage.
     * @param stage - The stage to evaluate for pending checks.
     * @returns True if there are pending checks, false otherwise.
     */
    isCheckPending(stage: IBuildStage): boolean;

}

import { IRunProgress } from "../../orchestrator/irunprogress";
import { IRun } from "../runcreator/irun";
import { IBuildStage } from "./ibuildstage";

/**
 * Interface for the ProgressMonitor class.
 */
export interface IProgressMonitor {
    /**
     * Creates a new IRunProgress object based on the provided IRun instance.
     * @param run - The IRun instance containing information about the build run.
     * @returns The newly created IRunProgress instance.
     */
    createRunProgress(run: IRun): IRunProgress;

    /**
     * Updates the progress of a build run based on the current state of its stages.
     * @param runProgress - The IRunProgress instance to update.
     * @returns The updated IRunProgress instance.
     * @throws {Error} If an error occurs during the update process.
     */
    updateRunProgress(runProgress: IRunProgress): IRunProgress;

    /**
     * Retrieves the active stages from the given IRunProgress instance.
     * @param runProgress - The IRunProgress instance to inspect.
     * @returns An array of IBuildStage instances that are currently active.
     */
    getActiveStages(runProgress: IRunProgress): IBuildStage[];

}

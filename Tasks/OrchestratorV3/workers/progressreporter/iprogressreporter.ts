import { IBuildParameters } from "../../helpers/taskhelper/ibuildparameters";
import { IFilters } from "../../helpers/taskhelper/ifilters";
import { Strategy } from "../../helpers/taskhelper/strategy";
import { IRunProgress } from "../../orchestrator/irunprogress";
import { IBuildStage } from "../progressmonitor/ibuildstage";
import { IRun } from "../runcreator/irun";

/**
 * Interface for the ProgressReporter class.
 */
export interface IProgressReporter {
    /**
     * Logs the details of a run.
     * @param run - The IRun instance containing the run details to be logged.
     */
    logRun(run: IRun): void;

    /**
    * Logs the build parameters.
    * @param parameters - IBuildParameters instance containing the build parameters to be logged.
    */
    logParameters(parameters: IBuildParameters): void;

    /**
     * Logs the filters based on the provided strategy.
     * @param filters - IFilters instance containing the filters to be logged.
     * @param strategy - Strategy enum value indicating the strategy used for filtering.
     */
    logFilters(filters: IFilters, strategy: Strategy): void;

    /**
     * Logs the progress of a build stage.
     * @param stage - IBuildStage instance containing the stage progress details to be logged.
     */
    logStageProgress(stageProgress: IBuildStage): void;

    /**
     * Logs the progress of all stages in a build.
     * @param stages - Array of IBuildStage instances containing the stages progress details to be logged.
     */
    logStagesProgress(stagesProgress: IBuildStage[]): void;

    /**
     * Logs the overall progress of a run.
     * @param runProgress - IRunProgress instance containing the run progress details to be logged.
     */
    logRunProgress(runProgress: IRunProgress): void;

}

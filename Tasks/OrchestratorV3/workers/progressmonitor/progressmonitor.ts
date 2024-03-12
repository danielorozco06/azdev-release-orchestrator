import { TaskResult, TimelineRecordState } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IProgressMonitor } from "./iprogressmonitor";
import { IDebug } from "../../loggers/idebug";
import { ILogger } from "../../loggers/ilogger";
import { IRun } from "../runcreator/irun";
import { IRunProgress } from "../../orchestrator/irunprogress";
import { RunStatus } from "../../orchestrator/runstatus";
import { IRunStage } from "../runcreator/irunstage";
import { IBuildStage } from "./ibuildstage";

/**
 * Class responsible for monitoring the progress of a build run.
 */
export class ProgressMonitor implements IProgressMonitor {

    private debugLogger: IDebug;

    /**
     * Initializes a new instance of the ProgressMonitor class.
     * @param logger - The ILogger instance to use for logging.
     */
    constructor(logger: ILogger) {

        this.debugLogger = logger.extend(this.constructor.name);

    }

    /**
     * Creates a new IRunProgress object based on the provided IRun instance.
     * @param run - The IRun instance containing information about the build run.
     * @returns The newly created IRunProgress instance.
     */
    public createRunProgress(run: IRun): IRunProgress {

        const debug = this.debugLogger.extend(this.createRunProgress.name);

        const runProgress: IRunProgress = {

            id: run.build.id!,
            name: run.build.buildNumber!,
            project: run.project.name!,
            url: `${run.project._links.web.href}/_build/results?buildId=${run.build.id}`,
            stages: [],
            status: RunStatus.InProgress,

        };

        const targetStages: IRunStage[] = run.stages.filter((stage) => stage.target === true);

        for (const stage of targetStages) {

            const buildStage: IBuildStage = {

                id: stage.id,
                name: stage.name,
                startTime: null,
                finishTime: null,
                state: TimelineRecordState.Pending,
                result: null,
                checkpoint: null,
                approvals: [],
                checks: [],
                jobs: [],
                attempt: {
                    stage: 0,
                    approval: 0,
                    check: 0,
                },

            };

            runProgress.stages.push(buildStage);

        }

        debug(runProgress);

        return runProgress;

    }

    /**
     * Updates the progress of a build run based on the current state of its stages.
     * @param runProgress - The IRunProgress instance to update.
     * @returns The updated IRunProgress instance.
     * @throws {Error} If an error occurs during the update process.
     */
    public updateRunProgress(runProgress: IRunProgress): IRunProgress {

        const debug = this.debugLogger.extend(this.updateRunProgress.name);

        const completedStages: string[] = runProgress.stages.filter(
            (stage) => this.isStageCompleted(stage)).map((stage) => stage.name);

        const activeStages: string[] = runProgress.stages.filter(
            (stage) => this.isStageActive(stage)).map((stage) => stage.name);

        const allStagesCompleted: boolean = completedStages.length === runProgress.stages.length;

        if (allStagesCompleted) {

            debug(`All run stages <${completedStages?.join("|")}> completed`);

            // Get non-succeeded stages
            const nonSucceededStages: boolean = this.isNonSucceededStages(runProgress.stages);

            if (nonSucceededStages) {

                runProgress.status = RunStatus.Failed;

            } else {

                // Get succeeded with issues stages
                const succeededWithIssuesStages: boolean = this.isSucceededWithIssuesStages(runProgress.stages);

                if (succeededWithIssuesStages) {

                    runProgress.status = RunStatus.PartiallySucceeded;

                } else {

                    runProgress.status = RunStatus.Succeeded;

                }

            }

        } else {

            debug(`Run stages <${activeStages?.join("|")}> in progress`);

            runProgress.status = RunStatus.InProgress;

        }

        debug(`Run status <${RunStatus[runProgress.status]}> updated`);

        return runProgress;

    }

    /**
     * Retrieves the active stages from the given IRunProgress instance.
     * @param runProgress - The IRunProgress instance to inspect.
     * @returns An array of IBuildStage instances that are currently active.
     */
    public getActiveStages(runProgress: IRunProgress): IBuildStage[] {

        const debug = this.debugLogger.extend(this.getActiveStages.name);

        const activeStages: IBuildStage[] = runProgress.stages.filter(
            (stage) => !this.isStageCompleted(stage));

        debug(activeStages);

        return activeStages;

    }

    /**
     * Determines if a given stage is completed.
     * @private
     * @param stage - The IBuildStage instance to check.
     * @returns True if the stage is completed, false otherwise.
     */
    private isStageCompleted(stage: IBuildStage): boolean {

        const debug = this.debugLogger.extend(this.isStageCompleted.name);

        const status: boolean = stage.state === TimelineRecordState.Completed;

        if (status) {

            debug(`Stage <${stage.name}> (${TimelineRecordState[stage.state!]}) is completed`);

        }

        return status;

    }

    /**
     * Determines if a given stage is active.
     * @private
     * @param stage - The IBuildStage instance to check.
     * @returns True if the stage is active, false otherwise.
     */
    private isStageActive(stage: IBuildStage): boolean {

        const debug = this.debugLogger.extend(this.isStageActive.name);

        const status: boolean = stage.state !== TimelineRecordState.Completed;

        if (status) {

            debug(`Stage <${stage.name}> (${TimelineRecordState[stage.state!]}) is active`);

        }

        return status;

    }

    /**
     * Checks if there are any non-succeeded stages in the provided array of IBuildStage.
     * @private
     * @param stages - The array of IBuildStage instances to check.
     * @returns True if there are non-succeeded stages, false otherwise.
     */
    private isNonSucceededStages(stages: IBuildStage[]): boolean {

        const nonSucceeded: boolean = stages.filter(
            (stage) =>
                stage.result === TaskResult.Failed ||
                stage.result === TaskResult.Canceled ||
                stage.result === TaskResult.Abandoned).length > 0;

        return nonSucceeded;

    }

    /**
     * Checks if there are any stages that succeeded with issues in the provided array of IBuildStage.
     * @private
     * @param stages - The array of IBuildStage instances to check.
     * @returns True if there are stages that succeeded with issues, false otherwise.
     */
    private isSucceededWithIssuesStages(stages: IBuildStage[]): boolean {

        const succeededWithIssues: boolean = stages.filter(
            (stage) => stage.result === TaskResult.SucceededWithIssues).length > 0;

        return succeededWithIssues;

    }

}

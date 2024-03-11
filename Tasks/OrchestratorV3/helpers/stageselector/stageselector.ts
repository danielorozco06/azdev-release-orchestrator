import { Build, StageUpdateType, Timeline, TimelineRecord, TimelineRecordState, UpdateStageParameters } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { ILogger } from "../../loggers/ilogger";
import { IDebug } from "../../loggers/idebug";
import { IStageSelector } from "./istageselector";
import { IBuildStage } from "../../workers/progressmonitor/ibuildstage";
import { IBuildJob } from "../../workers/progressmonitor/ibuildjob";
import { IBuildApiRetry } from "../../extensions/buildapiretry/ibuildapiretry";
import { IBuildTask } from "../../workers/progressmonitor/ibuildtask";
import { IBuildApproval } from "../../workers/progressmonitor/ibuildapproval";
import { IBuildCheck } from "../../workers/progressmonitor/ibuildcheck";
import { IBuildCheckpoint } from "../../workers/progressmonitor/ibuildcheckpoint";
import { IPipelinesApiRetry } from "../../extensions/pipelinesapiretry/ipipelineapiretry";
import { ICommonHelper } from "../commonhelper/icommonhelper";

/**
 * Class responsible for selecting and managing stages in Azure DevOps builds.
 */
export class StageSelector implements IStageSelector {

    private debugLogger: IDebug;

    private buildApi: IBuildApiRetry;
    private pipelinesApi: IPipelinesApiRetry;
    private commonHelper: ICommonHelper;

    /**
     * Constructs a new `StageSelector` instance.
     * @param buildApi - The build API with retry capabilities to interact with Azure DevOps.
     * @param pipelinesApi - The pipelines API with retry capabilities to interact with Azure DevOps.
     * @param commonHelper - A helper class providing common functionality.
     * @param logger - The logger instance for logging debug information.
     */
    constructor(buildApi: IBuildApiRetry, pipelinesApi: IPipelinesApiRetry, commonHelper: ICommonHelper, logger: ILogger) {

        this.debugLogger = logger.extend(this.constructor.name);

        this.buildApi = buildApi;
        this.pipelinesApi = pipelinesApi;
        this.commonHelper = commonHelper;

    }

    /**
     * Retrieves the details of a specific stage within a build.
     * @param build - The build containing the stage.
     * @param stage - The stage to retrieve.
     * @returns A promise that resolves to the updated `IBuildStage` object.
     * @throws Will throw an error if the timeline or stage timeline cannot be retrieved.
     */
    public async getStage(build: Build, stage: IBuildStage): Promise<IBuildStage> {

        const debug = this.debugLogger.extend(this.getStage.name);

        const buildTimeline: Timeline = await this.buildApi.getBuildTimeline(build.project!.name!, build.id!, build.orchestrationPlan!.planId);

        if (!buildTimeline) {

            throw new Error(`Unable to get <${build.buildNumber}> (${build.id}) build timeline`);

        }

        const stageTimeline: TimelineRecord | undefined = this.getTimelineRecord(buildTimeline, stage.name, "Stage");

        if (!stageTimeline) {

            throw new Error(`Unable to get <${build.buildNumber}> (${build.id}) build stage <${stage.name}> timeline`);

        }

        // Target stage ID changes with every new run
        // Re-assigning to support stage re-deployment
        stage.id = stageTimeline.id!;

        stage.startTime = stageTimeline.startTime!;
        stage.finishTime = stageTimeline.finishTime!;
        stage.state = stageTimeline.state!;
        stage.result = stageTimeline.result!;
        stage.approvals = [];
        stage.checks = [];
        stage.jobs = [];
        stage.attempt.stage = stageTimeline.attempt!;

        const stageCheckpoint: TimelineRecord | undefined = this.getChildTimelineRecord(buildTimeline, stageTimeline.id!, "Checkpoint");

        if (stageCheckpoint) {

            stage.checkpoint = this.newBuildCheckpoint(stageCheckpoint);
            stage.approvals = this.newBuildApprovals(buildTimeline, stageCheckpoint);
            stage.checks = this.newBuildChecks(buildTimeline, stageCheckpoint);

        }

        const stagePhases: TimelineRecord[] = this.getChildTimelineRecords(buildTimeline, stageTimeline.id!, "Phase");

        if (stagePhases.length) {

            stage.jobs = this.newBuildJobs(buildTimeline, stagePhases);

        }

        debug(stage);

        return stage;

    }

    /**
     * Initiates the start of a stage within a build.
     * @param build - The build containing the stage to start.
     * @param stage - The stage to start.
     * @returns A promise that resolves when the stage has been started.
     */
    public async startStage(build: Build, stage: IBuildStage): Promise<void> {

        const debug = this.debugLogger.extend(this.startStage.name);

        debug(`Starting <${stage.name}> (${stage.id}) stage progress`);

        const retryRequest: UpdateStageParameters = {

            forceRetryAllJobs: true,
            state: StageUpdateType.Retry,

        };

        await this.buildApi.updateStage(retryRequest, build.id!, stage.name, build.project?.name);

    }

    /**
     * Approves a stage within a build.
     * @param build - The build containing the stage to approve.
     * @param approval - The approval details for the stage.
     * @param comment - An optional comment for the approval.
     * @returns A promise that resolves to the result of the approval request.
     */
    public async approveStage(build: Build, approval: IBuildApproval, comment?: string): Promise<unknown> {

        const debug = this.debugLogger.extend(this.approveStage.name);

        const request: unknown = {

            approvalId: approval.id,
            status: "approved",
            comment: comment ? comment : "",

        };

        const approvalResult: unknown = await this.pipelinesApi.updateApproval(build, request);

        debug(approvalResult);

        return approvalResult;

    }

    /**
     * Confirms that a stage within a build has started successfully.
     * @param build - The build containing the stage to confirm.
     * @param stage - The stage to confirm.
     * @param maxAttempts - The maximum number of attempts to check if the stage has started.
     * @param interval - The interval in milliseconds between each attempt.
     * @returns A promise that resolves to the updated `IBuildStage` object.
     * @throws Will throw an error if the stage does not start within the specified attempts or if the stage is skipped or pending dependencies.
     */
    public async confirmStage(build: Build, stage: IBuildStage, maxAttempts: number, interval: number): Promise<IBuildStage> {

        const debug = this.debugLogger.extend(this.confirmStage.name);

        let started: boolean = false;
        let attempt: number = 0;

        do {

            if (attempt > maxAttempts) {

                throw new Error(`Unable to start <${stage.name}> (${TimelineRecordState[stage.state]}) stage progress (${attempt} attempts)`);

            }

            attempt++;

            debug(`Validating <${stage.name}> (${stage.id}) stage start (attempt ${attempt})`);

            if (attempt == 1) {

                // Minimum first attempt timout to improve
                // Validation experience under normal conditions
                await this.commonHelper.wait(10000);

            } else {

                await this.commonHelper.wait(interval);

            }

            stage = await this.getStage(build, stage);

            if (stage.state !== TimelineRecordState.Completed) {

                debug(`Stage <${stage.name}> (${stage.id}) successfully started`);

                started = true;

            }

        } while (!started);

        // Confirm stage is not skipped or pending dependencies
        // Must be done only after manual stage start attempt
        this.confirmStageState(stage);

        return stage;

    }

    /**
     * Validates the state of a stage to ensure it is not skipped or pending dependencies.
     * @param stage - The stage to validate.
     * @throws Will throw an error if the stage is skipped or pending dependencies.
     */
    private confirmStageState(stage: IBuildStage): void {

        const skipped: boolean = stage.result === 4 ? true : false;

        if (skipped) {

            throw new Error(`Target stage <${stage.name}> (${stage.id}) is skipped`);

        }

        const pending: boolean = stage.state === 0 && stage.checkpoint === null ? true : false;

        if (pending) {

            throw new Error(`Target stage <${stage.name}> (${stage.id}) is pending dependencies`);

        }

    }

    /**
     * Retrieves a timeline record by name and type from a build timeline.
     * @param timeline - The timeline to search within.
     * @param name - The name of the timeline record to find.
     * @param type - The type of the timeline record to find.
     * @returns The found `TimelineRecord` or undefined if not found.
     */
    private getTimelineRecord(timeline: Timeline, name: string, type: string): TimelineRecord | undefined {

        const timelineRecord: TimelineRecord | undefined = timeline.records!.find(
            (record: TimelineRecord) => record.name === name && record.type === type);

        return timelineRecord;

    }

    /**
     * Retrieves a child timeline record by parent ID and type from a build timeline.
     * @param timeline - The timeline to search within.
     * @param parentId - The parent ID of the timeline record to find.
     * @param type - The type of the timeline record to find.
     * @returns The found `TimelineRecord` or undefined if not found.
     */
    private getChildTimelineRecord(timeline: Timeline, parrentId: string, type: string): TimelineRecord | undefined {

        const timelineRecord: TimelineRecord | undefined = timeline.records!.find(
            (record: TimelineRecord) => record.parentId === parrentId && record.type === type);

        return timelineRecord;

    }

    /**
     * Retrieves all child timeline records by parent ID and type from a build timeline.
     * @param timeline - The timeline to search within.
     * @param parentId - The parent ID of the timeline records to find.
     * @param type - The type of the timeline records to find.
     * @returns An array of `TimelineRecord` objects.
     */
    private getChildTimelineRecords(timeline: Timeline, parentId: string, type: string): TimelineRecord[] {

        const timelineRecords: TimelineRecord[] = timeline.records!.filter(
            (record: TimelineRecord) => record.parentId === parentId && record.type === type).sort((left, right) => left.order! - right.order!);

        return timelineRecords;

    }

    /**
     * Creates an array of `IBuildJob` objects from timeline records.
     * @param timeline - The timeline containing the job records.
     * @param stagePhases - An array of `TimelineRecord` objects representing the phases of a stage.
     * @returns An array of `IBuildJob` objects.
     */
    private newBuildJobs(timeline: Timeline, stagePhases: TimelineRecord[]): IBuildJob[] {

        const result: IBuildJob[] = [];

        for (const phase of stagePhases) {

            const phaseJobs: TimelineRecord[] = this.getChildTimelineRecords(timeline, phase.id!, "Job");

            for (const job of phaseJobs) {

                const jobStatus: IBuildJob = this.newBuildJob(job);

                const jobTasks: TimelineRecord[] = this.getChildTimelineRecords(timeline, job.id!, "Task");

                for (const task of jobTasks) {

                    const taskStatus: IBuildTask = this.newBuildTask(task);

                    jobStatus.tasks.push(taskStatus);

                }

                result.push(jobStatus);

            }

        }

        return result;

    }

    /**
     * Creates a `IBuildCheckpoint` object from a timeline record.
     * @param timelineRecord - The timeline record to convert into a checkpoint.
     * @returns A `IBuildCheckpoint` object.
     */
    private newBuildCheckpoint(timelineRecord: TimelineRecord): IBuildCheckpoint {

        const buildCheckpoint: IBuildCheckpoint = {

            id: timelineRecord.id!,
            state: timelineRecord.state!,
            result: timelineRecord.result!,

        };

        return buildCheckpoint;

    }

    /**
     * Creates an array of `IBuildApproval` objects from timeline records.
     * @param timeline - The timeline containing the approval records.
     * @param stageCheckpoint - The `TimelineRecord` object representing the stage checkpoint.
     * @returns An array of `IBuildApproval` objects.
     */
    private newBuildApprovals(timeline: Timeline, stageCheckpoint: TimelineRecord): IBuildApproval[] {

        const result: IBuildApproval[] = [];

        const stageApprovalTimelines: TimelineRecord[] = this.getChildTimelineRecords(timeline, stageCheckpoint.id!, "Checkpoint.Approval");

        for (const approval of stageApprovalTimelines) {

            const buildApproval: IBuildApproval = this.newBuildApproval(approval);

            result.push(buildApproval);

        }

        return result;

    }

    /**
     * Creates an array of `IBuildCheck` objects from timeline records.
     * @param timeline - The timeline containing the check records.
     * @param stageCheckpoint - The `TimelineRecord` object representing the stage checkpoint.
     * @returns An array of `IBuildCheck` objects.
     */
    private newBuildChecks(timeline: Timeline, stageCheckpoint: TimelineRecord): IBuildApproval[] {

        const result: IBuildCheck[] = [];

        const stageCheckTimelines: TimelineRecord[] = this.getChildTimelineRecords(timeline, stageCheckpoint.id!, "Checkpoint.TaskCheck");

        for (const check of stageCheckTimelines) {

            const buildCheck: IBuildCheck = this.newBuildCheck(check);

            result.push(buildCheck);

        }

        return result;

    }

    /**
     * Creates a `IBuildJob` object from a timeline record.
     * @param timelineRecord - The timeline record to convert into a job.
     * @returns A `IBuildJob` object.
     */
    private newBuildJob(timelineRecord: TimelineRecord): IBuildJob {

        const buildJob: IBuildJob = {

            id: timelineRecord.id!,
            name: timelineRecord.name!,
            workerName: timelineRecord.workerName!,
            startTime: timelineRecord.startTime!,
            finishTime: timelineRecord.finishTime!,
            state: timelineRecord.state!,
            result: timelineRecord.result!,
            tasks: [],

        };

        return buildJob;

    }

    /**
     * Creates a `IBuildTask` object from a timeline record.
     * @param timelineRecord - The timeline record to convert into a task.
     * @returns A `IBuildTask` object.
     */
    private newBuildTask(timelineRecord: TimelineRecord): IBuildTask {

        const buildTask: IBuildTask = {

            id: timelineRecord.id!,
            name: timelineRecord.name!,
            startTime: timelineRecord.startTime!,
            finishTime: timelineRecord.finishTime!,
            state: timelineRecord.state!,
            result: timelineRecord.result!,

        };

        return buildTask;

    }

    /**
     * Creates a `IBuildApproval` object from a timeline record.
     * @param timelineRecord - The timeline record to convert into an approval.
     * @returns A `IBuildApproval` object.
     */
    private newBuildApproval(timelineRecord: TimelineRecord): IBuildApproval {

        const buildApproval: IBuildApproval = {

            id: timelineRecord.id!,
            state: timelineRecord.state!,
            result: timelineRecord.result!,

        };

        return buildApproval;

    }

    /**
     * Creates a `IBuildCheck` object from a timeline record.
     * @param timelineRecord - The timeline record to convert into a check.
     * @returns A `IBuildCheck` object.
     */
    private newBuildCheck(timelineRecord: TimelineRecord): IBuildCheck {

        const buildCheck: IBuildCheck = {

            id: timelineRecord.id!,
            state: timelineRecord.state!,
            result: timelineRecord.result!,

        };

        return buildCheck;

    }

}

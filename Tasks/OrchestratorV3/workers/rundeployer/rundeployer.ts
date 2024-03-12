import { IRunDeployer } from "./irundeployer";
import { IDebug } from "../../loggers/idebug";
import { ILogger } from "../../loggers/ilogger";
import { IRun } from "../runcreator/irun";
import { IRunProgress } from "../../orchestrator/irunprogress";
import { IProgressMonitor } from "../progressmonitor/iprogressmonitor";
import { RunStatus } from "../../orchestrator/runstatus";
import { ICommonHelper } from "../../helpers/commonhelper/icommonhelper";
import { IProgressReporter } from "../progressreporter/iprogressreporter";
import { IBuildStage } from "../progressmonitor/ibuildstage";
import { IStageDeployer } from "../stagedeployer/istagedeployer";

/**
 * Class responsible for deploying runs either manually or automatically.
 */
export class RunDeployer implements IRunDeployer {

    private logger: ILogger;
    private debugLogger: IDebug;

    private commonHelper: ICommonHelper;
    private stageDeployer: IStageDeployer;
    private progressMonitor: IProgressMonitor;
    private progressReporter: IProgressReporter;

    /**
     * Constructs a new instance of the RunDeployer.
     * @param commonHelper - Helper for common operations.
     * @param stageDeployer - Deployer for individual stages.
     * @param progressMonitor - Monitor for tracking run progress.
     * @param progressReporter - Reporter for logging progress.
     * @param logger - Logger for standard logging.
     */
    constructor(commonHelper: ICommonHelper, stageDeployer: IStageDeployer, progressMonitor: IProgressMonitor, progressReporter: IProgressReporter, logger: ILogger) {

        this.logger = logger;
        this.debugLogger = logger.extend(this.constructor.name);

        this.commonHelper = commonHelper;
        this.stageDeployer = stageDeployer;
        this.progressMonitor = progressMonitor;
        this.progressReporter = progressReporter;

    }

    /**
     * Deploys a run manually.
     * @param run - The run to be deployed.
     * @returns A promise that resolves with the updated run progress.
     */
    public async deployManual(run: IRun): Promise<IRunProgress> {

        const debug = this.debugLogger.extend(this.deployManual.name);

        let runProgress: IRunProgress = this.progressMonitor.createRunProgress(run);

        debug(`Starting <${runProgress.name}> (${runProgress.id}) run <${RunStatus[runProgress.status]}> progress tracking`);

        for (let stage of runProgress.stages) {

            stage = await this.stageDeployer.deployManual(stage, run.build, run.settings);

            runProgress = this.progressMonitor.updateRunProgress(runProgress);

        }

        this.logger.log(`Run <${runProgress.name}> (${runProgress.id}) progress <${RunStatus[runProgress.status]}> tracking ${run.settings.skipTracking ? "skipped" : "completed"}`);

        this.progressReporter.logStagesProgress(runProgress.stages);

        return runProgress;

    }

    /**
     * Deploys a run in an automated fashion.
     * @param run - The run to be deployed.
     * @returns A promise that resolves with the updated run progress.
     */
    public async deployAutomated(run: IRun): Promise<IRunProgress> {

        const debug = this.debugLogger.extend(this.deployAutomated.name);

        let runProgress: IRunProgress = this.progressMonitor.createRunProgress(run);

        this.logger.log(`Starting <${runProgress.name}> (${runProgress.id}) run <${RunStatus[runProgress.status]}> progress tracking`);

        let inProgress: boolean = true;

        while (inProgress) {

            debug(`Updating <${runProgress.stages.map((stage) => stage.name)?.join("|")}> active stage(s) progress`);

            const activeStages: IBuildStage[] = this.progressMonitor.getActiveStages(runProgress);

            for (let stage of activeStages) {

                stage = await this.stageDeployer.deployAutomated(stage, run.build, run.settings);

            }

            runProgress = this.progressMonitor.updateRunProgress(runProgress);

            if (runProgress.status === RunStatus.InProgress) {

                if (run.settings.skipTracking) {

                    inProgress = false;

                }

                await this.commonHelper.wait(run.settings.updateInterval);

            } else {

                inProgress = false;

            }

        }

        this.logger.log(`Run <${runProgress.name}> (${runProgress.id}) progress <${RunStatus[runProgress.status]}> tracking ${run.settings.skipTracking ? "skipped" : "completed"}`);

        this.progressReporter.logStagesProgress(runProgress.stages);

        return runProgress;

    }

}

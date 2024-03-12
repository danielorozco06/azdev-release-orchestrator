import { IRun } from "../runcreator/irun";
import { IRunProgress } from "../../orchestrator/irunprogress";

/**
 * Interface for the RunDeployer class.
 */
export interface IRunDeployer {
    /**
     * Deploys a run manually.
     * @param run - The run to be deployed.
     * @returns A promise that resolves with the updated run progress.
     */
    deployManual(run: IRun): Promise<IRunProgress>;

    /**
     * Deploys a run in an automated fashion.
     * @param run - The run to be deployed.
     * @returns A promise that resolves with the updated run progress.
     */
    deployAutomated(run: IRun): Promise<IRunProgress>;

}

import { IParameters } from "../helpers/taskhelper/iparameters";
import { IRunProgress } from "./irunprogress";

/**
 * Orchestrator class implements IOrchestrator interface to coordinate the execution of deployment strategies.
 */
export interface IOrchestrator {
    /**
     * Orchestrates the deployment process based on the provided parameters.
     * @param {IParameters} parameters - The parameters that define the deployment strategy and other options.
     * @returns {Promise<IRunProgress>} A promise that resolves to an IRunProgress object representing the progress of the run.
     */
    orchestrate(parameters: IParameters): Promise<IRunProgress>;

}

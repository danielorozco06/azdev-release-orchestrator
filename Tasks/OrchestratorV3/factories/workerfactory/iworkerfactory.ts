import { IRunDeployer } from "../../workers/rundeployer/irundeployer";
import { IRunCreator } from "../../workers/runcreator/iruncreator";
import { IProgressReporter } from "../../workers/progressreporter/iprogressreporter";

/**
 * Interface for the WorkerFactory class.
 */
export interface IWorkerFactory {
    /**
     * Creates an instance of RunCreator with all necessary dependencies.
     * @returns {Promise<IRunCreator>} A promise that resolves to an instance of IRunCreator.
     */
    createRunCreator(): Promise<IRunCreator>;

    /**
     * Creates an instance of RunDeployer with all necessary dependencies.
     * @returns {Promise<IRunDeployer>} A promise that resolves to an instance of IRunDeployer.
     */
    createRunDeployer(): Promise<IRunDeployer>;

    /**
     * Creates an instance of ProgressReporter.
     * @returns {Promise<IProgressReporter>} A promise that resolves to an instance of IProgressReporter.
     */
    createProgressReporter(): Promise<IProgressReporter>;

}

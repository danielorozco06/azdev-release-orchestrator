import { IEndpoint } from "./iendpoint";
import { IParameters } from "./iparameters";
import { RunStatus } from "../../orchestrator/runstatus";

/**
 * TaskHelper class implements ITaskHelper interface to provide methods for retrieving endpoint details,
 * task parameters, validating run status, and handling task failure.
 */
export interface ITaskHelper {
    /**
     * Retrieves the endpoint details from the pipeline's environment.
     * @returns {Promise<IEndpoint>} A promise that resolves to an object containing the endpoint URL and token.
     * @throws {Error} Throws an error if the endpoint URL or token cannot be retrieved.
     */
    getEndpoint(): Promise<IEndpoint>;

    /**
     * Retrieves the parameters specified for the task from the pipeline's environment.
     * @returns {Promise<IParameters>} A promise that resolves to an object containing all the task parameters.
     */
    getParameters(): Promise<IParameters>;

    /**
     * Validates the run status and sets the task result accordingly.
     * @param {RunStatus} status - The current run status of the pipeline.
     * @returns {Promise<void>} A promise that resolves when the validation is complete.
     * @throws {Error} Throws an error if the run status indicates a failure.
     */
    validate(status: RunStatus): Promise<void>;

    /**
     * Marks the task as failed with an optional message.
     * @param {string} message - The message to log when the task fails.
     * @returns {Promise<void>} A promise that resolves when the task is marked as failed.
     */
    fail(message: string): Promise<void>;

}

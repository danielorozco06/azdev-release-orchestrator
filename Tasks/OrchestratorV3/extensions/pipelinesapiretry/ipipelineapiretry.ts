import { Build, BuildDefinition } from "azure-devops-node-api/interfaces/BuildInterfaces";

/**
 * Class providing retryable methods for interacting with Azure DevOps Pipelines API.
 */
export interface IPipelinesApiRetry {
    /**
     * Queues a new run for the given build definition.
     * This method is decorated with `@Retryable()` to automatically retry failed attempts.
     * @param definition - The build definition from which to queue a run.
     * @param request - The request payload to send when queuing the run.
     * @returns A promise that resolves to the queued run object.
     * @throws Will throw an error if unable to create the definition run.
     */
    queueRun(definition: BuildDefinition, request: unknown): Promise<unknown>;

    /**
     * Updates the approval for a given build.
     * This method does not use REST API retry and relies on the approval retry mechanism instead.
     * @param build - The build for which to update the approval.
     * @param request - The request payload to send when updating the approval.
     * @returns A promise that resolves to the updated approval object.
     * @throws Will throw an error if unable to update the build approval.
     */
    updateApproval(build: Build, request: unknown): Promise<unknown>;

}

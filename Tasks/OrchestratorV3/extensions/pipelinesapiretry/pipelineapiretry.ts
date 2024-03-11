/* eslint-disable @typescript-eslint/no-explicit-any */

import { Build, BuildDefinition } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IApiClient } from "../../common/iapiclient";
import { Retryable } from "../../common/retry";
import { IDebug } from "../../loggers/idebug";
import { ILogger } from "../../loggers/ilogger";
import { IPipelinesApiRetry } from "./ipipelineapiretry";

/**
 * Class providing retryable methods for interacting with Azure DevOps Pipelines API.
 */
export class PipelinesApiRetry implements IPipelinesApiRetry {

    private debugLogger: IDebug;

    private apiClient: IApiClient;

    /**
     * Constructs a new `PipelinesApiRetry` instance.
     * @param apiClient - The API client to be used for making HTTP requests.
     * @param logger - The logger instance for logging debug information.
     */
    constructor(apiClient: IApiClient, logger: ILogger) {

        this.debugLogger = logger.extend(this.constructor.name);

        this.apiClient = apiClient;

    }

    /**
     * Queues a new run for the given build definition.
     * This method is decorated with `@Retryable()` to automatically retry failed attempts.
     * @param definition - The build definition from which to queue a run.
     * @param request - The request payload to send when queuing the run.
     * @returns A promise that resolves to the queued run object.
     * @throws Will throw an error if unable to create the definition run.
     */
    @Retryable()
    public async queueRun(definition: BuildDefinition, request: unknown): Promise<unknown> {

        const run: unknown = await this.apiClient.post(`${definition.project?.name}/_apis/pipelines/${definition.id}/runs`, "5.1-preview.1", request);

        if (!run) {

            throw new Error(`Unable to create <${definition.name}> (${definition.id}) definition run`);

        }

        return run;

    }

    /**
     * Updates the approval for a given build.
     * This method does not use REST API retry and relies on the approval retry mechanism instead.
     * @param build - The build for which to update the approval.
     * @param request - The request payload to send when updating the approval.
     * @returns A promise that resolves to the updated approval object.
     * @throws Will throw an error if unable to update the build approval.
     */
    // Do not use REST API retry for approvals
    // Rely on approval retry mechanism instead
    public async updateApproval(build: Build, request: unknown): Promise<unknown> {

        const approval: any = await this.apiClient.patch(`${build.project?.name}/_apis/pipelines/approvals`, "5.1-preview.1", [request]);

        if (!Array.isArray(approval.value) && approval.value.length <= 0) {

            throw new Error(`Unable to update <${build.buildNumber}> (${build.id}) build approval`);

        }

        return approval.value[0];

    }

}

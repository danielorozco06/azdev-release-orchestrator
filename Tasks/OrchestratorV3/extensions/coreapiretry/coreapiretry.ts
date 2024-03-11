import { TeamProject } from "azure-devops-node-api/interfaces/CoreInterfaces";
import { ICoreApi } from "azure-devops-node-api/CoreApi";

import { ICoreApiRetry } from "./icoreapiretry";
import { Retryable } from "../../common/retry";

/**
 * A retryable wrapper for Azure DevOps Core API.
 */
export class CoreApiRetry implements ICoreApiRetry {

    private coreApi: ICoreApi;

    /**
     * Constructs a new instance of the CoreApiRetry class.
     * @param coreApi - The ICoreApi instance for making REST calls to Azure DevOps services.
     */
    constructor(coreApi: ICoreApi) {

        this.coreApi = coreApi;

    }

    /**
     * Retrieves a project by its ID with optional capabilities and history inclusion.
     * @param projectId - The ID of the project to retrieve.
     * @param includeCapabilities - Optional flag to include capabilities (e.g., version control, process template).
     * @param includeHistory - Optional flag to include project history.
     * @returns A promise that resolves to the TeamProject object.
     */
    @Retryable()
    public async getProject(projectId: string, includeCapabilities?: boolean, includeHistory?: boolean): Promise<TeamProject> {

        return await this.coreApi.getProject(
            projectId,
            includeCapabilities,
            includeHistory);

    }

}

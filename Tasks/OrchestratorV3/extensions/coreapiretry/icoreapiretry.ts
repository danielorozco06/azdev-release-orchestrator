import { ICoreApi } from "azure-devops-node-api/CoreApi";
import { TeamProject } from "azure-devops-node-api/interfaces/CoreInterfaces";

/**
 * A retryable wrapper for Azure DevOps Core API.
 */
export interface ICoreApiRetry extends Partial<ICoreApi> {
    /**
     * Retrieves a project by its ID with optional capabilities and history inclusion.
     * @param projectId - The ID of the project to retrieve.
     * @param includeCapabilities - Optional flag to include capabilities (e.g., version control, process template).
     * @param includeHistory - Optional flag to include project history.
     * @returns A promise that resolves to the TeamProject object.
     */
    getProject(projectId: string, includeCapabilities?: boolean, includeHistory?: boolean): Promise<TeamProject>;

}

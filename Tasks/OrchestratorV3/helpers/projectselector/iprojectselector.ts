import { TeamProject } from "azure-devops-node-api/interfaces/CoreInterfaces";

/**
 * Class responsible for selecting team projects from Azure DevOps.
 */
export interface IProjectSelector {
    /**
     * Retrieves a team project by its ID.
     * @param projectId - The ID of the Azure DevOps team project to retrieve.
     * @returns A promise that resolves to the requested `TeamProject`.
     * @throws Will throw an error if the project is not found.
     */
    getProject(projectId: string): Promise<TeamProject>;

}

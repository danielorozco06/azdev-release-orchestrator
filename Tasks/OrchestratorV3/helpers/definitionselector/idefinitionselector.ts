import { BuildDefinition } from "azure-devops-node-api/interfaces/BuildInterfaces";

/**
 * Class responsible for selecting build definitions from Azure DevOps.
 */
export interface IDefinitionSelector {
    /**
     * Retrieves a build definition by its name within a given project.
     * @param projectName - The name of the Azure DevOps project.
     * @param definitionName - The name of the build definition to retrieve.
     * @returns A promise that resolves to the requested `BuildDefinition`.
     * @throws Will throw an error if the definition is not found.
     */
    getDefinition(projectName: string, definitionName: string): Promise<BuildDefinition>;

}

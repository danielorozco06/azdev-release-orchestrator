import { BuildDefinition } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { ILogger } from "../../loggers/ilogger";
import { IDebug } from "../../loggers/idebug";
import { IDefinitionSelector } from "./idefinitionselector";
import { IBuildApiRetry } from "../../extensions/buildapiretry/ibuildapiretry";

/**
 * Class responsible for selecting build definitions from Azure DevOps.
 */
export class DefinitionSelector implements IDefinitionSelector {

    private debugLogger: IDebug;

    private buildApi: IBuildApiRetry;

    /**
     * Constructs a new `DefinitionSelector` instance.
     * @param buildApi - The build API with retry capabilities to interact with Azure DevOps.
     * @param logger - The logger instance for logging debug information.
     */
    constructor(buildApi: IBuildApiRetry, logger: ILogger) {

        this.debugLogger = logger.extend(this.constructor.name);

        this.buildApi = buildApi;

    }

    /**
     * Retrieves a build definition by its name within a given project.
     * @param projectName - The name of the Azure DevOps project.
     * @param definitionName - The name of the build definition to retrieve.
     * @returns A promise that resolves to the requested `BuildDefinition`.
     * @throws Will throw an error if the definition is not found.
     */
    public async getDefinition(projectName: string, definitionName: string): Promise<BuildDefinition> {

        const debug = this.debugLogger.extend(this.getDefinition.name);

        const matchingDefinitions: BuildDefinition[] = await this.buildApi.getDefinitions(projectName, definitionName);

        debug(matchingDefinitions.map(
            (definition) => `${definition.name} (${definition.id})`));

        if (matchingDefinitions.length <= 0) {

            throw new Error(`Definition <${definitionName}> not found`);

        }

        const targetDefinition: BuildDefinition = await this.buildApi.getDefinition(
            projectName,
            matchingDefinitions[0].id!);

        debug(targetDefinition);

        return targetDefinition;

    }

}

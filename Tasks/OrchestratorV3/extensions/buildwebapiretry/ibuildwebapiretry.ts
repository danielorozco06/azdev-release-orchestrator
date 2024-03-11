import { Build, BuildDefinition } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IBuildParameters } from "../../helpers/taskhelper/ibuildparameters";
import { IRepositoryFilter } from "../../workers/filtercreator/irepositoryfilter";
import { IBuildStage } from "../../workers/progressmonitor/ibuildstage";

/**
 * A retryable wrapper for Azure DevOps Build Web API.
 */
export interface IBuildWebApiRetry {

    /**
     * Retrieves detailed information about a build run.
     * @param build - The build object containing details like project ID and build ID.
     * @returns A promise that resolves to the run details.
     * @throws Error if unable to retrieve run details.
     */
    getRunDetails(build: Build): Promise<unknown>;

    /**
    * Retrieves parameters for a pipeline run based on the build definition.
    * @param definition - The build definition from which to retrieve run parameters.
    * @param repository - Optional filter for repository details.
    * @param parameters - Optional build parameters.
    * @returns A promise that resolves to the run parameters.
    * @throws Error if unable to retrieve run parameters.
    */
    getRunParameters(definition: BuildDefinition, repository?: IRepositoryFilter, parameters?: IBuildParameters): Promise<unknown>;

    /**
     * Retrieves checks for a specific stage of a build run.
     * @param build - The build object containing details like project ID and build ID.
     * @param stage - The build stage for which to retrieve checks.
     * @returns A promise that resolves to the run stage checks.
     * @throws Error if unable to retrieve run stage checks.
     */
    getRunStageChecks(build: Build, stage: IBuildStage): Promise<unknown>;

}

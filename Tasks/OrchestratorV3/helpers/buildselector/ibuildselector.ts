import { Build, BuildDefinition } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IBuildFilter } from "../../workers/filtercreator/ibuildfilter";
import { IResourcesFilter } from "../../workers/filtercreator/iresourcesfilter";
import { IBuildParameters } from "../taskhelper/ibuildparameters";
import { IRunStage } from "../../workers/runcreator/irunstage";

/**
 * Class responsible for selecting and managing Azure DevOps builds.
 */
export interface IBuildSelector {
    /**
     * Creates a new build based on the provided definition, resources filter, optional stages, and parameters.
     * @param definition - The build definition from which to create the build.
     * @param resourcesFilter - The resources filter to apply to the build.
     * @param stages - Optional array of stage names to include in the build.
     * @param parameters - Optional dictionary of build parameters.
     * @returns A promise that resolves to the created Build object.
     */
    createBuild(definition: BuildDefinition, resourcesFilter: IResourcesFilter, stages?: string[], parameters?: IBuildParameters): Promise<Build>;

    /**
     * Retrieves the latest build for the given definition and filter criteria.
     * @param definition - The build definition to query.
     * @param filter - The build filter to apply to the query.
     * @param top - The maximum number of builds to retrieve.
     * @returns A promise that resolves to the latest Build object.
     */
    getLatestBuild(definition: BuildDefinition, filter: IBuildFilter, top: number): Promise<Build>;

    /**
     * Retrieves a specific build by its build number.
     * @param definition - The build definition to query.
     * @param buildNumber - The build number of the build to retrieve.
     * @returns A promise that resolves to the requested Build object.
     */
    getSpecificBuild(definition: BuildDefinition, buildNumber: string): Promise<Build>;

    /**
    * Retrieves the stages of a given build that match the specified stage names.
    * @param build - The build whose stages are to be retrieved.
    * @param stages - An array of stage names to filter the stages.
    * @returns A promise that resolves to an array of IRunStage objects.
    */
    getBuildStages(build: Build, stages: string[]): Promise<IRunStage[]>;

    /**
     * Cancels the specified build.
     * @param build - The build to cancel.
     * @returns A promise that resolves to the canceled Build object.
     */
    cancelBuild(build: Build): Promise<Build>;

}

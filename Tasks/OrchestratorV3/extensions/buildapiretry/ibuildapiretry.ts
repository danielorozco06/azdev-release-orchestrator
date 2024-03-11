import { IBuildApi } from "azure-devops-node-api/BuildApi";
import { Build, BuildDefinition, BuildDefinitionReference, BuildQueryOrder, BuildReason, BuildResult, BuildStatus, DefinitionQueryOrder, QueryDeletedOption, Timeline, UpdateStageParameters } from "azure-devops-node-api/interfaces/BuildInterfaces";

/**
 * A retryable wrapper for Azure DevOps Build API.
 */
export interface IBuildApiRetry extends Partial<IBuildApi> {

    /**
     * Retrieves a specific build.
     * @param project - The name or ID of the project.
     * @param buildId - The ID of the build.
     * @param propertyFilters - A comma-delimited list of properties to include in the results.
     * @returns A promise that resolves to the requested Build object.
     */
    getBuild(project: string, buildId: number, propertyFilters?: string): Promise<Build>;

    /**
     * Retrieves a list of builds.
     * @param project - The name or ID of the project.
     * @param definitions - An array of definition IDs to filter the results.
     * @param queues - An array of queue IDs to filter the results.
     * @param buildNumber - The build number to match.
     * @param minTime - The minimum time for the builds to have been created.
     * @param maxTime - The maximum time for the builds to have been created.
     * @param requestedFor - The identity for the user who requested the build.
     * @param reasonFilter - The reason filter (e.g., manual, individualCI, batchedCI).
     * @param statusFilter - The build status filter (e.g., none, inProgress, completed).
     * @param resultFilter - The build result filter (e.g., none, succeeded, failed).
     * @param tagFilters - An array of tags to filter the results.
     * @param properties - An array of properties to include in the results.
     * @param top - The maximum number of builds to retrieve.
     * @param continuationToken - A continuation token, returned by a previous call to this method, that can be used to return the next set of builds.
     * @param maxBuildsPerDefinition - The maximum number of builds to retrieve per definition.
     * @param deletedFilter - Filter to include deleted builds in the results.
     * @param queryOrder - The order in which builds should be returned.
     * @param branchName - The name of the branch to filter on.
     * @param buildIds - An array of build IDs to filter the results.
     * @param repositoryId - The repository ID to filter the results.
     * @param repositoryType - The repository type to filter the results.
     * @returns A promise that resolves to an array of Build objects.
     */
    getBuilds(project: string, definitions?: number[], queues?: number[], buildNumber?: string, minTime?: Date, maxTime?: Date, requestedFor?: string, reasonFilter?: BuildReason, statusFilter?: BuildStatus, resultFilter?: BuildResult, tagFilters?: string[], properties?: string[], top?: number, continuationToken?: string, maxBuildsPerDefinition?: number, deletedFilter?: QueryDeletedOption, queryOrder?: BuildQueryOrder, branchName?: string, buildIds?: number[], repositoryId?: string, repositoryType?: string): Promise<Build[]>;

    /**
     * Retrieves the timeline for a particular build.
     * @param project - The name or ID of the project.
     * @param buildId - The ID of the build.
     * @param timelineId - The ID of the timeline to retrieve.
     * @param changeId - The change ID.
     * @param planId - The plan ID for the timeline.
     * @returns A promise that resolves to the requested Timeline object.
     */
    getBuildTimeline(project: string, buildId: number, timelineId?: string, changeId?: number, planId?: string): Promise<Timeline>;

    /**
     * Queues a new build.
     * @param build - The build to queue.
     * @param project - The name or ID of the project.
     * @param ignoreWarnings - If true, ignore any warnings during the queueing process.
     * @param checkInTicket - The ticket associated with the source control check-in.
     * @param sourceBuildId - The ID of the source build.
     * @param definitionId - The ID of the definition that is being queued.
     * @returns A promise that resolves to the queued Build object.
     */
    queueBuild(build: Build, project: string, ignoreWarnings?: boolean, checkInTicket?: string, sourceBuildId?: number, definitionId?: number): Promise<Build>;

    /**
     * Updates an existing build.
     * @param build - The build to update.
     * @param project - The name or ID of the project.
     * @param buildId - The ID of the build to update.
     * @param retry - If true, retries the build.
     * @returns A promise that resolves to the updated Build object.
     */
    updateBuild(build: Build, project: string, buildId: number, retry?: boolean): Promise<Build>;

    /**
     * Retrieves a specific build definition.
     * @param project - The name or ID of the project.
     * @param definitionId - The ID of the build definition.
     * @param revision - The revision number of the definition.
     * @param minMetricsTime - The minimum metrics time.
     * @param propertyFilters - An array of property filters.
     * @param includeLatestBuilds - If true, includes the latest builds.
     * @returns A promise that resolves to the requested BuildDefinition object.
     */
    getDefinition(project: string, definitionId: number, revision?: number, minMetricsTime?: Date, propertyFilters?: string[], includeLatestBuilds?: boolean): Promise<BuildDefinition>;

    /**
     * Retrieves a list of build definitions.
     * @param project - The name or ID of the project.
     * @param name - The name of the definition.
     * @param repositoryId - The repository ID to filter the results.
     * @param repositoryType - The repository type to filter the results.
     * @param queryOrder - The order in which definitions should be returned.
     * @param top - The maximum number of definitions to retrieve.
     * @param continuationToken - A continuation token, returned by a previous call to this method, that can be used to return the next set of definitions.
     * @param minMetricsTime - The minimum metrics time.
     * @param definitionIds - An array of definition IDs to filter the results.
     * @param path - The path to filter the results.
     * @param builtAfter - The date after which a definition must have been built.
     * @param notBuiltAfter - The date before which a definition must not have been built.
     * @param includeAllProperties - If true, includes all properties.
     * @param includeLatestBuilds - If true, includes the latest builds.
     * @param taskIdFilter - The task ID to filter the results.
     * @param processType - The process type to filter the results.
     * @param yamlFilename - The YAML filename to filter the results.
     * @returns A promise that resolves to an array of BuildDefinitionReference objects.
     */
    getDefinitions(project: string, name?: string, repositoryId?: string, repositoryType?: string, queryOrder?: DefinitionQueryOrder, top?: number, continuationToken?: string, minMetricsTime?: Date, definitionIds?: number[], path?: string, builtAfter?: Date, notBuiltAfter?: Date, includeAllProperties?: boolean, includeLatestBuilds?: boolean, taskIdFilter?: string, processType?: number, yamlFilename?: string): Promise<BuildDefinitionReference[]>;

    /**
     * Updates the stage of a build.
     * @param updateParameters - The parameters for the update.
     * @param buildId - The ID of the build whose stage is to be updated.
     * @param stageRefName - The reference name of the stage to update.
     * @param project - The name or ID of the project. Optional if already specified in the client context.
     * @throws Error if unable to update the stage status.
     */
    updateStage(updateParameters: UpdateStageParameters, buildId: number, stageRefName: string, project?: string): Promise<void>;

}

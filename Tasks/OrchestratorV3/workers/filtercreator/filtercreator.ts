import { BuildResult, BuildStatus } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IBuildFilter } from "./ibuildfilter";
import { IDebug } from "../../loggers/idebug";
import { ILogger } from "../../loggers/ilogger";
import { IFilterCreator } from "./ifiltercreator";
import { IResourcesFilter } from "./iresourcesfilter";
import { IFilters } from "../../helpers/taskhelper/ifilters";
import { IRepositoryFilter } from "./irepositoryfilter";
import { IPipelineFilter } from "./ipipelinefilter";

/**
 * FilterCreator class is responsible for creating filters based on the provided IFilters.
 */
export class FilterCreator implements IFilterCreator {

    private debugLogger: IDebug;

    /**
     * Constructs a new instance of FilterCreator with a logger.
     * @param {ILogger} logger - The logger to use for debugging.
     */
    constructor(logger: ILogger) {

        this.debugLogger = logger.extend(this.constructor.name);

    }

    /**
     * Creates a resources filter based on the given filters.
     * @param {IFilters} filters - The filters to use for creating the resources filter.
     * @returns {Promise<IResourcesFilter>} A promise that resolves to an IResourcesFilter object.
     * @throws {Error} Throws an error if there is an issue during the creation of the resources filter.
     *
     * ### Steps:
     * 1. Extend the debug logger with the name of the current method.
     * 2. Initialize an empty resources filter object.
     * 3. If branchName is present in filters, add a repository filter for 'self'.
     * 4. Iterate over pipelineResources in filters and add corresponding pipeline filters.
     * 5. Iterate over repositoryResources in filters and add corresponding repository filters.
     * 6. Log the created resources filter.
     * 7. Return the resources filter.
     */
    public async createResourcesFilter(filters: IFilters): Promise<IResourcesFilter> {

        const debug = this.debugLogger.extend(this.createResourcesFilter.name);

        const resourcesFilter: IResourcesFilter = {

            repositories: {},
            pipelines: {},

        };

        if (filters.branchName) {

            const self: IRepositoryFilter = {

                refName: `refs/heads/${filters.branchName}`,
                version: "",

            };

            resourcesFilter.repositories["self"] = self;

        }

        if (Object.keys(filters.pipelineResources).length) {

            for (const resource of Object.keys(filters.pipelineResources)) {

                const pipelineFilter: IPipelineFilter = {

                    version: filters.pipelineResources[resource],

                };

                resourcesFilter.pipelines[resource] = pipelineFilter;

            }

        }

        if (Object.keys(filters.repositoryResources).length) {

            for (const resource of Object.keys(filters.repositoryResources)) {

                const repositoryFilter: IRepositoryFilter = {

                    refName: `refs/heads/${filters.repositoryResources[resource]}`,
                    version: "",

                };

                resourcesFilter.repositories[resource] = repositoryFilter;

            }

        }

        debug(resourcesFilter);

        return resourcesFilter;

    }

    /**
     * Creates a build filter based on the given filters.
     * @param {IFilters} filters - The filters to use for creating the build filter.
     * @returns {Promise<IBuildFilter>} A promise that resolves to an IBuildFilter object.
     * @throws {Error} Throws an error if there is an issue during the creation of the build filter.
     *
     * ### Steps:
     * 1. Extend the debug logger with the name of the current method.
     * 2. Initialize an empty build filter object with default statuses.
     * 3. Set the buildResult in the build filter if it's specified in filters.
     * 4. Set the tagFilters in the build filter based on filters.
     * 5. Set the branchName in the build filter if it's specified in filters.
     * 6. Log the created build filter.
     * 7. Return the build filter.
     */
    public async createBuildFilter(filters: IFilters): Promise<IBuildFilter> {

        const debug = this.debugLogger.extend(this.createBuildFilter.name);

        const buildFilter: IBuildFilter = {

            buildStatus: [
                BuildStatus.None,
                BuildStatus.InProgress,
                BuildStatus.Completed,
                BuildStatus.NotStarted,
            ],
            buildResult: filters.buildResult ? (<never>BuildResult)[filters.buildResult] : undefined,
            tagFilters: filters.buildTags,
            branchName: filters.branchName ? `refs/heads/${filters.branchName}` : "",

        };

        debug(buildFilter);

        return buildFilter;

    }

}

import { IPipelineFilter } from "./ipipelinefilter";
import { IRepositoryFilter } from "./irepositoryfilter";

/**
 * Interface representing a filter configuration for resources.
 * It contains filters for both repositories and pipelines, indexed by a string key.
 */
export interface IResourcesFilter {
    /**
     * A collection of repository filters, where each key is a string identifier
     * for the repository, and the value is an instance of IRepositoryFilter.
     */
    repositories: {
        [key: string]: IRepositoryFilter;
    };

    /**
     * A collection of pipeline filters, where each key is a string identifier
     * for the pipeline, and the value is an instance of IPipelineFilter.
     */
    pipelines: {
        [key: string]: IPipelineFilter;
    };
}

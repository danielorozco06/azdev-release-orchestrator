import { IFilters } from "../../helpers/taskhelper/ifilters";
import { IBuildFilter } from "./ibuildfilter";
import { IResourcesFilter } from "./iresourcesfilter";

/**
 * FilterCreator class is responsible for creating filters based on the provided IFilters.
 */
export interface IFilterCreator {
    /**
     * Creates a resources filter based on the given filters.
     * @param {IFilters} filters - The filters to use for creating the resources filter.
     * @returns {Promise<IResourcesFilter>} A promise that resolves to an IResourcesFilter object.
     * @throws {Error} Throws an error if there is an issue during the creation of the resources filter.
     */
    createResourcesFilter(filters: IFilters): Promise<IResourcesFilter>;

    /**
     * Creates a build filter based on the given filters.
     * @param {IFilters} filters - The filters to use for creating the build filter.
     * @returns {Promise<IBuildFilter>} A promise that resolves to an IBuildFilter object.
     * @throws {Error} Throws an error if there is an issue during the creation of the build filter.
     */
    createBuildFilter(filters: IFilters): Promise<IBuildFilter>;

}

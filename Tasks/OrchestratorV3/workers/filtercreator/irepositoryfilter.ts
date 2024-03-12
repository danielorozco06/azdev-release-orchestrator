/**
 * Interface representing a filter for repository queries.
 */
export interface IRepositoryFilter {
    /**
     * The name of the repository to filter on.
     */
    refName: string;

    /**
     * The version of the filter
     */
    version: string;

}

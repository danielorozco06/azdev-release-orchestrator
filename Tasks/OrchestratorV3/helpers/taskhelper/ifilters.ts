/**
 * Interface representing the filters used to select specific builds.
 */
export interface IFilters {
    /** The build number to filter by. */
    buildNumber: string;

    /** The name of the branch to filter by. */
    branchName: string;

    /** The result of the build to filter by (e.g., 'success', 'failure'). */
    buildResult: string;

    /** An array of tags to filter the builds by. */
    buildTags: string[];

    /**
     * A dictionary of pipeline resources to filter by, with keys representing the resource names
     * and values representing the corresponding versions or identifiers.
     */
    pipelineResources: {
        [key: string]: string;
    };

    /**
     * A dictionary of repository resources to filter by, with keys representing the repository names
     * and values representing the corresponding branches, tags, or commit IDs.
     */
    repositoryResources: {
        [key: string]: string;
    };
}

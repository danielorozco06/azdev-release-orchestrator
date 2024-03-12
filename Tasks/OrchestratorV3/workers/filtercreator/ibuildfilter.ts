import { BuildResult, BuildStatus } from "azure-devops-node-api/interfaces/BuildInterfaces";

/**
 * Interface representing the structure of a build filter.
 */
export interface IBuildFilter {
    /**
     * An array of BuildStatus indicating the status of builds to filter.
     * @type {BuildStatus[]}
     */
    buildStatus: BuildStatus[];

    /**
     * The result of the build to filter, if undefined no build result filter is applied.
     * @type {BuildResult | undefined}
     */
    buildResult: BuildResult | undefined;

    /**
     * An array of strings representing tags used to filter builds.
     * @type {string[]}
     */
    tagFilters: string[];

    /**
     * The name of the branch to filter builds, represented as a full ref name.
     * @type {string}
     */
    branchName: string;
}

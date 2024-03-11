/**
 * Interface representing the details associated with a particular project or release.
 */
export interface IDetails {
    /** The name of the endpoint being used. */
    endpointName: string;

    /** The name of the project. */
    projectName: string;

    /** The name of the release. */
    releaseName: string;

    /** The name of the person requesting the operation. */
    requesterName: string;

    /** The unique identifier of the requester. */
    requesterId: string;
}

/**
 * Interface representing the configuration for an API endpoint.
 */
export interface IEndpoint {
    /** The URL of the API endpoint. */
    url: string;

    /** The authentication token required to access the API endpoint. */
    token: string;
}

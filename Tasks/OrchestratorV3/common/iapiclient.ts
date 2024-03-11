/* eslint-disable @typescript-eslint/no-explicit-any */

import { IRestResponse } from "typed-rest-client";

/**
 * ApiClient class implements IApiClient interface to provide methods for making REST API calls.
 */
export interface IApiClient {

    /**
     * Performs a GET request to the specified path and returns the response.
     * @param {string} path - The API path to send the GET request to.
     * @returns {Promise<T>} A promise that resolves with the result of the API call.
     */
    get<T>(path: string): Promise<T>;

    /**
     * Performs a POST request to the specified path with an optional body and returns the response.
     * @param {string} path - The API path to send the POST request to.
     * @param {string} [apiVersion] - The API version to use in the accept header.
     * @param {any} [body] - The body of the POST request.
     * @returns {Promise<T>} A promise that resolves with the result of the API call.
     */
    post<T>(path: string, apiVersion?: string, body?: any): Promise<T>;

    /**
     * Performs a PATCH request to the specified path with an optional body and returns the response or raw response based on the raw parameter.
     * @param {string} path - The API path to send the PATCH request to.
     * @param {string} [apiVersion] - The API version to use in the accept header.
     * @param {any} [body] - The body of the PATCH request.
     * @param {boolean} [raw=false] - If true, returns the raw IRestResponse object instead of the result.
     * @returns {Promise<T | IRestResponse<T>>} A promise that resolves with the result of the API call or the raw response.
     */
    patch<T>(path: string, apiVersion?: string, body?: any, raw?: boolean): Promise<T | IRestResponse<T>>;

    /**
     * Performs a PUT request to the specified path with an optional body and returns the response.
     * @param {string} path - The API path to send the PUT request to.
     * @param {string} [apiVersion] - The API version to use in the accept header.
     * @param {any} [body] - The body of the PUT request.
     * @returns {Promise<T>} A promise that resolves with the result of the API call.
     */
    put<T>(path: string, apiVersion?: string, body?: any): Promise<T>;

    /**
     * Performs a DELETE request to the specified path and returns the response.
     * @param {string} path - The API path to send the DELETE request to.
     * @param {string} [apiVersion] - The API version to use in the accept header.
     * @returns {Promise<T>} A promise that resolves with the result of the API call.
     */
    delete<T>(path: string, apiVersion?: string): Promise<T>;

}

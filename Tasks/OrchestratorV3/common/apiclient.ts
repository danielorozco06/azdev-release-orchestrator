/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { VsoClient } from "azure-devops-node-api/VsoClient";
import { IRequestOptions, IRestResponse } from "typed-rest-client";

import { IDebug } from "../loggers/idebug";
import { ILogger } from "../loggers/ilogger";
import { IApiClient } from "./iapiclient";

/**
 * ApiClient class implements IApiClient interface to provide methods for making REST API calls.
 */
export class ApiClient implements IApiClient {

    private debugLogger: IDebug;

    private vsoClient: VsoClient;

    /**
     * Constructs a new instance of the ApiClient class.
     * @param {VsoClient} vsoClient - The VSO client used to make API calls.
     * @param {ILogger} logger - The logger for logging messages.
     */
    constructor(vsoClient: VsoClient, logger: ILogger) {

        this.debugLogger = logger.extend(this.constructor.name);

        this.vsoClient = vsoClient;

    }

    /**
     * Performs a GET request to the specified path and returns the response.
     * @param {string} path - The API path to send the GET request to.
     * @returns {Promise<T>} A promise that resolves with the result of the API call.
     */
    public async get<T>(path: string): Promise<T> {

        const debug = this.debugLogger.extend(this.get.name);

        const url: string = `${this.vsoClient.baseUrl}/${path}`;

        debug(`Making <${url}> API <GET> call`);

        const response: IRestResponse<any> = await this.vsoClient.restClient.get(url);

        if (response.statusCode) {

            debug(`Response status code <${response.statusCode}> received`);

        }

        return response.result;

    }

    /**
     * Performs a POST request to the specified path with an optional body and returns the response.
     * @param {string} path - The API path to send the POST request to.
     * @param {string} [apiVersion] - The API version to use in the accept header.
     * @param {any} [body] - The body of the POST request.
     * @returns {Promise<T>} A promise that resolves with the result of the API call.
     */
    public async post<T>(path: string, apiVersion?: string, body?: any): Promise<T> {

        const debug = this.debugLogger.extend(this.post.name);

        const url: string = `${this.vsoClient.baseUrl}/${path}`;

        debug(`Making <${url}> API <POST> call`);

        const requestOptions: IRequestOptions = {};

        if (apiVersion) {

            requestOptions.acceptHeader = `api-version=${apiVersion}`;

        }

        const response: IRestResponse<any> = await this.vsoClient.restClient.create(url, body, requestOptions);

        if (response.statusCode) {

            debug(`Response status code <${response.statusCode}> received`);

        }

        return response.result;

    }

    /**
     * Performs a PATCH request to the specified path with an optional body and returns the response or raw response based on the raw parameter.
     * @param {string} path - The API path to send the PATCH request to.
     * @param {string} [apiVersion] - The API version to use in the accept header.
     * @param {any} [body] - The body of the PATCH request.
     * @param {boolean} [raw=false] - If true, returns the raw IRestResponse object instead of the result.
     * @returns {Promise<T | IRestResponse<T>>} A promise that resolves with the result of the API call or the raw response.
     */
    public async patch<T>(path: string, apiVersion?: string, body?: any, raw?: boolean): Promise<T | IRestResponse<T>> {

        const debug = this.debugLogger.extend(this.patch.name);

        const url: string = `${this.vsoClient.baseUrl}/${path}`;

        debug(`Making <${url}> API <PATCH> call`);

        const requestOptions: IRequestOptions = {};

        if (apiVersion) {

            requestOptions.acceptHeader = `api-version=${apiVersion}`;

        }

        const response: IRestResponse<any> = await this.vsoClient.restClient.update(url, body, requestOptions);

        if (response.statusCode) {

            debug(`Response status code <${response.statusCode}> received`);

        }

        if (raw) {

            return response;

        } else {

            return response.result;

        }

    }

    /**
     * Performs a PUT request to the specified path with an optional body and returns the response.
     * @param {string} path - The API path to send the PUT request to.
     * @param {string} [apiVersion] - The API version to use in the accept header.
     * @param {any} [body] - The body of the PUT request.
     * @returns {Promise<T>} A promise that resolves with the result of the API call.
     */
    public async put<T>(path: string, apiVersion?: string, body?: any): Promise<T> {

        const debug = this.debugLogger.extend(this.put.name);

        const url: string = `${this.vsoClient.baseUrl}/${path}`;

        debug(`Making <${url}> API <PUT> call`);

        const requestOptions: IRequestOptions = {};

        if (apiVersion) {

            requestOptions.acceptHeader = `api-version=${apiVersion}`;

        }

        const response: IRestResponse<any> = await this.vsoClient.restClient.replace(url, body, requestOptions);

        if (response.statusCode) {

            debug(`Response status code <${response.statusCode}> received`);

        }

        return response.result;

    }

    /**
     * Performs a DELETE request to the specified path and returns the response.
     * @param {string} path - The API path to send the DELETE request to.
     * @param {string} [apiVersion] - The API version to use in the accept header.
     * @returns {Promise<T>} A promise that resolves with the result of the API call.
     */
    public async delete<T>(path: string, apiVersion?: string): Promise<T> {

        const debug = this.debugLogger.extend(this.delete.name);

        const url: string = `${this.vsoClient.baseUrl}/${path}`;

        debug(`Making <${url}> API <DELETE> call`);

        const requestOptions: IRequestOptions = {};

        if (apiVersion) {

            requestOptions.acceptHeader = `api-version=${apiVersion}`;

        }

        const response: IRestResponse<any> = await this.vsoClient.restClient.del(url, requestOptions);

        if (response.statusCode) {

            debug(`Response status code <${response.statusCode}> received`);

        }

        return response.result;

    }

}

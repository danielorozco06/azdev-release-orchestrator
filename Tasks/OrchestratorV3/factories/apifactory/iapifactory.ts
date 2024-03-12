import { ICoreApiRetry } from "../../extensions/coreapiretry/icoreapiretry";
import { IBuildApiRetry } from "../../extensions/buildapiretry/ibuildapiretry";
import { IBuildWebApiRetry } from "../../extensions/buildwebapiretry/ibuildwebapiretry";
import { IPipelinesApiRetry } from "../../extensions/pipelinesapiretry/ipipelineapiretry";

/**
 * Interface for ApiFactory
 */
export interface IApiFactory {
    /**
     * Creates an instance of CoreApi with retry capabilities.
     * @returns {Promise<ICoreApiRetry>} A promise that resolves to an instance of ICoreApiRetry.
     */
    createCoreApi(): Promise<ICoreApiRetry>;

    /**
     * Creates an instance of BuildApi with retry capabilities.
     * @returns {Promise<IBuildApiRetry>} A promise that resolves to an instance of IBuildApiRetry.
     */
    createBuildApi(): Promise<IBuildApiRetry>;

    /**
     * Creates an instance of PipelinesApi with retry capabilities.
     * @returns {Promise<IPipelinesApiRetry>} A promise that resolves to an instance of IPipelinesApiRetry.
     */
    createPipelinesApi(): Promise<IPipelinesApiRetry>;

    /**
     * Creates an instance of BuildWebApi with retry capabilities.
     * @returns {Promise<IBuildWebApiRetry>} A promise that resolves to an instance of IBuildWebApiRetry.
     */
    createBuildWebApi(): Promise<IBuildWebApiRetry>;

}

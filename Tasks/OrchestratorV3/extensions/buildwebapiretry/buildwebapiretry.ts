/* eslint-disable @typescript-eslint/no-explicit-any */

import { Build, BuildDefinition } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { IApiClient } from "../../common/iapiclient";
import { Retryable } from "../../common/retry";
import { IBuildParameters } from "../../helpers/taskhelper/ibuildparameters";
import { IDebug } from "../../loggers/idebug";
import { ILogger } from "../../loggers/ilogger";
import { IRepositoryFilter } from "../../workers/filtercreator/irepositoryfilter";
import { IBuildStage } from "../../workers/progressmonitor/ibuildstage";
import { IBuildWebApiRetry } from "./ibuildwebapiretry";

/**
 * A retryable wrapper for Azure DevOps Build Web API.
 */
export class BuildWebApiRetry implements IBuildWebApiRetry {

    private debugLogger: IDebug;

    private apiClient: IApiClient;

    /**
     * Constructs a new instance of the BuildWebApiRetry class.
     * @param apiClient - The IApiClient instance for making REST calls.
     * @param logger - The ILogger instance for logging.
     */
    constructor(apiClient: IApiClient, logger: ILogger) {

        this.debugLogger = logger.extend(this.constructor.name);

        this.apiClient = apiClient;

    }

    /**
     * Retrieves detailed information about a build run.
     * @param build - The build object containing details like project ID and build ID.
     * @returns A promise that resolves to the run details.
     * @throws Error if unable to retrieve run details.
     */
    @Retryable()
    public async getRunDetails(build: Build): Promise<unknown> {

        const debug = this.debugLogger.extend(this.getRunDetails.name);

        const body: unknown = {

            contributionIds: [
                "ms.vss-build-web.run-details-data-provider",
            ],
            dataProviderContext: {
                properties: {
                    buildId: `${build.id}`,
                    sourcePage: {
                        routeId: "ms.vss-build-web.ci-results-hub-route",
                        routeValues: {
                            project: build.project?.name,
                        },
                    },
                },
            },

        };

        const result: any = await this.apiClient.post(`_apis/Contribution/HierarchyQuery/project/${build.project?.id}`, "5.0-preview.1", body);

        const runDetails: unknown = result.dataProviders["ms.vss-build-web.run-details-data-provider"];

        if (!runDetails || result.dataProviderExceptions) {

            debug(result);

            throw new Error(`Unable to retrieve <${build.buildNumber}> (${build.id}) run details`);

        }

        return runDetails;

    }

    /**
    * Retrieves parameters for a pipeline run based on the build definition.
    * @param definition - The build definition from which to retrieve run parameters.
    * @param repository - Optional filter for repository details.
    * @param parameters - Optional build parameters.
    * @returns A promise that resolves to the run parameters.
    * @throws Error if unable to retrieve run parameters.
    */
    @Retryable()
    public async getRunParameters(definition: BuildDefinition, repository?: IRepositoryFilter, parameters?: IBuildParameters): Promise<unknown> {

        const debug = this.debugLogger.extend(this.getRunParameters.name);

        const body: unknown = {

            contributionIds: [
                "ms.vss-build-web.pipeline-run-parameters-data-provider",
            ],
            dataProviderContext: {
                properties: {
                    onlyFetchTemplateParameters: false,
                    pipelineId: definition.id,
                    sourceBranch: repository ? repository.refName : "",
                    sourceVersion: repository ? repository.version : "",
                    sourcePage: {
                        routeId: "ms.vss-build-web.pipeline-details-route",
                        routeValues: {
                            project: definition.project?.name,
                        },
                    },
                    templateParameters: (parameters && Object.keys(parameters).length) ? parameters : {},
                },
            },

        };

        const result: any = await this.apiClient.post(`_apis/Contribution/HierarchyQuery/project/${definition.project?.id}`, "5.0-preview.1", body);

        const runParameters: unknown = result.dataProviders["ms.vss-build-web.pipeline-run-parameters-data-provider"];

        if (!runParameters || result.dataProviderExceptions) {

            debug(result);

            throw new Error(`Unable to retrieve <${definition.name}> (${definition.id}) run parameters`);

        }

        return runParameters;

    }

    /**
     * Retrieves checks for a specific stage of a build run.
     * @param build - The build object containing details like project ID and build ID.
     * @param stage - The build stage for which to retrieve checks.
     * @returns A promise that resolves to the run stage checks.
     * @throws Error if unable to retrieve run stage checks.
     */
    @Retryable()
    public async getRunStageChecks(build: Build, stage: IBuildStage): Promise<unknown> {

        const debug = this.debugLogger.extend(this.getRunStageChecks.name);

        const body: unknown = {

            contributionIds: [
                "ms.vss-build-web.checks-panel-data-provider",
            ],
            dataProviderContext: {
                properties: {
                    buildId: `${build.id}`,
                    stageIds: stage.id,
                    checkListItemType: 3,
                    sourcePage: {
                        routeId: "ms.vss-build-web.ci-results-hub-route",
                        routeValues: {
                            project: build.project?.name,
                        },
                    },
                },
            },

        };

        const result: any = await this.apiClient.post(`_apis/Contribution/HierarchyQuery/project/${build.project?.id}`, "5.0-preview.1", body);

        const runStageChecks: unknown = result.dataProviders["ms.vss-build-web.checks-panel-data-provider"][0];

        if (!runStageChecks || result.dataProviderExceptions) {

            debug(result);

            throw new Error(`Unable to retrieve <${build.buildNumber}> (${build.id}) run stage <${stage.name}> (${stage.id}) checks`);

        }

        return runStageChecks;

    }

}

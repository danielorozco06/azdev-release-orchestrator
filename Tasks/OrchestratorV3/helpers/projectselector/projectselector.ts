import { TeamProject } from "azure-devops-node-api/interfaces/CoreInterfaces";

import { IDebug } from "../../loggers/idebug";
import { IProjectSelector } from "./iprojectselector";
import { ICoreApiRetry } from "../../extensions/coreapiretry/icoreapiretry";
import { ILogger } from "../../loggers/ilogger";

/**
 * Class responsible for selecting team projects from Azure DevOps.
 */
export class ProjectSelector implements IProjectSelector {

    private debugLogger: IDebug;

    private coreApi: ICoreApiRetry;

    /**
     * Constructs a new `ProjectSelector` instance.
     * @param coreApi - The core API with retry capabilities to interact with Azure DevOps.
     * @param logger - The logger instance for logging debug information.
     */
    constructor(coreApi: ICoreApiRetry, logger: ILogger) {

        this.debugLogger = logger.extend(this.constructor.name);

        this.coreApi = coreApi;

    }

    /**
     * Retrieves a team project by its ID.
     * @param projectId - The ID of the Azure DevOps team project to retrieve.
     * @returns A promise that resolves to the requested `TeamProject`.
     * @throws Will throw an error if the project is not found.
     */
    public async getProject(projectId: string): Promise<TeamProject> {

        const debug = this.debugLogger.extend(this.getProject.name);

        const targetProject: TeamProject = await this.coreApi.getProject(projectId);

        if (!targetProject) {

            throw new Error(`Project <${projectId}> not found`);

        }

        debug(targetProject);

        return targetProject;

    }

}

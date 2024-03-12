import { TeamProject } from "azure-devops-node-api/interfaces/CoreInterfaces";
import { Build, BuildDefinition } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { ISettings } from "../../helpers/taskhelper/isettings";
import { IRunStage } from "./irunstage";

/**
 * Interface representing a run, which includes project details, build definition, the build itself,
 * stages involved in the run, and settings.
 */
export interface IRun {
    /** The Azure DevOps project associated with the run. */
    project: TeamProject;

    /** The build definition used for the run. */
    definition: BuildDefinition;

    /** The build that was either created or identified for the run. */
    build: Build;

    /** An array of stages that are part of the run. */
    stages: IRunStage[];

    /** Settings for the run, as defined by ISettings. */
    settings: ISettings;
}

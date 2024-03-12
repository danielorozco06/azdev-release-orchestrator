import { Build } from "azure-devops-node-api/interfaces/BuildInterfaces";

import { ISettings } from "../../helpers/taskhelper/isettings";
import { IBuildStage } from "../progressmonitor/ibuildstage";

/**
 * Interface for stage deployer.
 */
export interface IStageDeployer {
    /**
     * Deploys a stage manually and handles its progress.
     * @param stage - The stage to deploy.
     * @param build - The build that contains the stage.
     * @param settings - Settings containing deployment configuration.
     * @returns A promise that resolves with the updated stage after deployment attempts.
     */
    deployManual(stage: IBuildStage, build: Build, settings: ISettings): Promise<IBuildStage>;

    /**
     * Deploys a stage automatically and updates its progress.
     * @param stage - The stage to deploy.
     * @param build - The build that contains the stage.
     * @param settings - Settings containing deployment configuration.
     * @returns A promise that resolves with the updated stage after deployment attempts.
     */
    deployAutomated(stage: IBuildStage, build: Build, settings: ISettings): Promise<IBuildStage>;

}

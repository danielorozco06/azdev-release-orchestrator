import { IParameters } from "../../helpers/taskhelper/iparameters";
import { IRun } from "./irun";

/**
 * Interface for the RunCreator class.
 */
export interface IRunCreator {
    /**
     * Creates a run based on the provided parameters and strategy.
     * @param parameters - IParameters instance containing the parameters for run creation.
     * @returns A Promise that resolves to an IRun instance representing the created run.
     */
    create(parameters: IParameters): Promise<IRun>;

}

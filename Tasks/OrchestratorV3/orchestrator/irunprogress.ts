import { IBuildStage } from "../workers/progressmonitor/ibuildstage";
import { RunStatus } from "./runstatus";

/**
 * Interface representing the progress of a run.
 * @interface
 */
export interface IRunProgress {
    /** Unique identifier for the run. */
    id: number;
    /** Name of the run. */
    name: string;
    /** Project associated with the run. */
    project: string;
    /** URL to access details about the run. */
    url: string;
    /** Array of build stages involved in the run. */
    stages: IBuildStage[];
    /** Current status of the run, as defined by the RunStatus enum. */
    status: RunStatus;
}

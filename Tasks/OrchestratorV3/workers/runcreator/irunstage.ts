/**
 * Interface representing a single stage within a run.
 */
export interface IRunStage {
    /** Unique identifier for the stage. */
    id: string;

    /** Human-readable name of the stage. */
    name: string;

    /** Indicates whether this stage is the target stage for the run. */
    target: boolean;
}

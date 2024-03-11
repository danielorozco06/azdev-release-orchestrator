/**
 * Interface representing the settings configuration.
 */
export interface ISettings {
    /** The interval in milliseconds between update checks. */
    updateInterval: number;

    /** The number of attempts to start a stage before failing. */
    stageStartAttempts: number;

    /** The interval in milliseconds between attempts to start a stage. */
    stageStartInterval: number;

    /** The interval in milliseconds between approval checks. */
    approvalInterval: number;

    /** The number of attempts to approve a stage before timing out. */
    approvalAttempts: number;

    /** Whether to cancel the checkpoint if it fails. */
    cancelFailedCheckpoint: boolean;

    /** Whether to proceed with skipped stages automatically. */
    proceedSkippedStages: boolean;

    /** Whether to skip tracking of updates. */
    skipTracking: boolean;
}

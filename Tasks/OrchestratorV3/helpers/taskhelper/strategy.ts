/**
 * Enum for defining update strategies.
 * @enum {string}
 */
export enum Strategy {
    /** Use the newest version available. */
    New = "New",

    /** Use the latest stable version. */
    Latest = "Latest",

    /** Use a specific version. */
    Specific = "Specific",
}

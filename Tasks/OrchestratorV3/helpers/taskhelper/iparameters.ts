import { IFilters } from "./ifilters";
import { Strategy } from "./strategy";
import { ISettings } from "./isettings";
import { IBuildParameters } from "./ibuildparameters";
import { IDetails } from "./idetails";

/**
 * Interface representing the parameters required for a build process.
 */
export interface IParameters {
    /** The strategy to be used for the build process. */
    strategy: Strategy;

    /** The name of the project where the build will take place. */
    projectName: string;

    /** The name of the definition that will be used for the build. */
    definitionName: string;

    /** An array of stage names that are part of the build process. */
    stages: string[];

    /** Build parameters specific to the build process. */
    parameters: IBuildParameters;

    /** Filters that determine which builds to consider. */
    filters: IFilters;

    /** Settings configuration for the build process. */
    settings: ISettings;

    /** Detailed information about the build process. */
    details: IDetails;
}

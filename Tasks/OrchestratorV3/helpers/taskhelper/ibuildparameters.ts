/**
 * Interface representing a dictionary of build parameters.
 * The keys are strings, and the values can be either strings or booleans.
 */
export interface IBuildParameters {
    /**
     * Index signature for the dictionary.
     * Allows any number of properties with string keys and values of type string or boolean.
     */
    [key: string]: string | boolean;
}

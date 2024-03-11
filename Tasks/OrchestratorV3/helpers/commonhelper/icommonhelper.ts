/**
 * CommonHelper class implements ICommonHelper interface to provide common utility methods.
 */
export interface ICommonHelper {
    /**
     * Waits for a specified number of milliseconds.
     * @param {number} count - The number of milliseconds to wait.
     * @returns {Promise<void>} A promise that resolves after the specified wait time.
     */
    wait(count: number): Promise<void>;

    /**
     * Parses a key-value pair from a string input.
     * @param {string} input - The input string containing the key-value pair.
     * @returns {[string, string]} A tuple containing the key and value as strings.
     * @throws {Error} Throws an error if the input cannot be parsed into a key-value pair.
     */
    parseKeyValue(input: string): [string, string];

}

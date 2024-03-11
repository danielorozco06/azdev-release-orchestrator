import { IDebug } from "../../loggers/idebug";
import { ICommonHelper } from "./icommonhelper";
import { ILogger } from "../../loggers/ilogger";

/**
 * CommonHelper class implements ICommonHelper interface to provide common utility methods.
 */
export class CommonHelper implements ICommonHelper {

    private debugLogger: IDebug;

    /**
     * Constructs a new instance of the CommonHelper class.
     * @param {ILogger} logger - The logger used for debugging purposes.
     */
    constructor(logger: ILogger) {

        this.debugLogger = logger.extend(this.constructor.name);

    }

    /**
     * Waits for a specified number of milliseconds.
     * @param {number} count - The number of milliseconds to wait.
     * @returns {Promise<void>} A promise that resolves after the specified wait time.
     */
    public async wait(count: number): Promise<void> {

        const debug = this.debugLogger.extend(this.wait.name);

        debug(`Waiting <${count}> milliseconds`);

        return new Promise((resolve) => setTimeout(resolve, count));

    }

    /**
     * Parses a key-value pair from a string input.
     * @param {string} input - The input string containing the key-value pair.
     * @returns {[string, string]} A tuple containing the key and value as strings.
     * @throws {Error} Throws an error if the input cannot be parsed into a key-value pair.
     */
    public parseKeyValue(input: string): [string, string] {

        const matchRegex = /^\s*([\w\\.\\-\s]+)\s*=\s*(.*)?\s*$/;

        const match: RegExpMatchArray | null = input.match(matchRegex);

        if (match === null) {

            throw new Error(`Unable to parse <${input}> input`);

        }

        const key = match[1].trim();
        const value = match[2] ? match[2].trim() : "";

        return [key, value];

    }

}

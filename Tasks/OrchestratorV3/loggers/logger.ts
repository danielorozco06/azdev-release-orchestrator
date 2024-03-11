/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import Debug from "debug";

import { IDebug } from "./idebug";
import { ILogger } from "./ilogger";

/**
 * Logger class implements ILogger interface to provide logging functionality.
 */
export class Logger implements ILogger {

    private debugLogger: IDebug;

    /**
     * Constructs a new instance of the Logger class.
     * @param {string} name - The namespace for the debug logger.
     * @param {boolean} [force=false] - If true, forces the debug logger to be enabled.
     */
    constructor(name: string, force: boolean = false) {

        this.debugLogger = Debug(name);

        if (force === true) {

            Debug.enable(`${name}:*`);

        }

    }

    /**
     * Logs a message to the console.
     * @param {any} message - The message to log. Can be any type.
     */
    public log(message: any): void {

        console.log(message);

    }

    /**
     * Logs a warning message to the console.
     * @param {any} message - The warning message to log. Can be any type.
     */
    public warn(message: any): void {

        console.warn(message);

    }

    /**
     * Extends the current debug logger with a new namespace.
     * @param {string} name - The name of the new namespace to extend the debug logger with.
     * @returns {IDebug} A new debug logger instance with an extended namespace.
     */
    public extend(name: string): IDebug {

        return this.debugLogger.extend(name);

    }

}

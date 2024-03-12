/* eslint-disable @typescript-eslint/no-explicit-any */

import { IDebug } from "./idebug";

/**
 * Interface for the logger.
 */
export interface ILogger {
    /**
     * Logs a message to the console.
     * @param {any} message - The message to log. Can be any type.
     */
    log(message: any): void;

    /**
     * Logs a warning message to the console.
     * @param {any} message - The warning message to log. Can be any type.
     */
    warn(message: any): void;

    /**
     * Extends the current debug logger with a new namespace.
     * @param {string} name - The name of the new namespace to extend the debug logger with.
     * @returns {IDebug} A new debug logger instance with an extended namespace.
     */
    extend(name: string): IDebug;

}

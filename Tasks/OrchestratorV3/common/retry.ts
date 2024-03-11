/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import { IDebug } from "../loggers/idebug";
import { ILogger } from "../loggers/ilogger";
import { Logger } from "../loggers/logger";

const logger: ILogger = new Logger("release-orchestrator");
const debugLogger: IDebug = logger.extend("Retry");

/**
 * Decorator that makes a method retryable.
 * @param attempts - The number of attempts to retry the decorated method. Defaults to 10.
 * @param timeout - The timeout in milliseconds between retries. Defaults to 10000 (10 seconds).
 * @param empty - Whether to retry on an empty result. Defaults to false.
 * @returns A function that can be used to decorate a method with retry logic.
 */
export function Retryable(attempts: number = 10, timeout: number = 10000, empty: boolean = false): Function {

    const debug = debugLogger.extend("retryable");

    return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {

        const originalMethod: Function = descriptor.value;

        descriptor.value = async function (...args: any[]) {

            try {

                debug(`Executing <${propertyKey}> with <${attempts}> retries`);

                return await retryAsync.apply(this, [originalMethod, args, attempts, timeout, empty]);

            } catch (e: any) {

                e.message = `Failed retrying <${propertyKey}> for <${attempts}> times. ${e.message}`;

                throw e;

            }

        };

        return descriptor;

    };

}

/**
 * Asynchronously retries a function call until it succeeds or the maximum number of attempts is reached.
 * @param target - The function to retry.
 * @param args - The arguments to pass to the function.
 * @param attempts - The number of attempts remaining.
 * @param timeout - The timeout in milliseconds between retries.
 * @param empty - Whether to retry on an empty result.
 * @returns A promise that resolves to the result of the function call or rejects if all attempts fail.
 */
async function retryAsync(target: Function, args: any[], attempts: number, timeout: number, empty: boolean): Promise<any> {

    const debug = debugLogger.extend("retryAsync");

    try {

        // @ts-ignore
        let result: any = await target.apply(this, args);

        if (!result && empty) {

            if (--attempts <= 0) {

                throw new Error("Empty result received");

            }

            debug(`Retrying <${target.name}> (empty) in <${timeout / 1000}> seconds`);

            await new Promise((resolve) => setTimeout(resolve, timeout));

            // @ts-ignore
            result = retryAsync.apply(this, [target, args, attempts, timeout, empty]);

        }

        return result;

    } catch (e: any) {

        if (--attempts <= 0) {

            throw new Error(e);

        }

        debug(`Retrying <${target.name}> (exception) in <${timeout / 1000}> seconds`);

        debug(e);

        await new Promise((resolve) => setTimeout(resolve, timeout));

        // @ts-ignore
        return retryAsync.apply(this, [target, args, attempts, timeout]);

    }

}

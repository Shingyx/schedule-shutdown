import { getDriver } from './lib/drivers';
import { parseAndValidateMinutes } from './lib/utilities';

/**
 * Schedules a shutdown after the provided duration has elapsed
 * @param duration - Number of minutes or a non-empty string matching the regular expression "(\d+h)?(\d+m)?"
 * @param verbose - If set to true, the internal commands and their outputs will be logged
 * @returns The scheduled shutdown time
 */
export async function scheduleShutdown(
    duration: number | string,
    verbose: boolean = false,
): Promise<Date> {
    const minutes = parseAndValidateMinutes(duration);
    const start = Date.now();
    await getDriver(process.platform).scheduleShutdown(minutes, verbose);
    return new Date(start + minutes * 60 * 1000);
}

/**
 * Schedules a restart after the provided duration has elapsed
 * @param duration - Number of minutes or a non-empty string matching the regular expression "(\d+h)?(\d+m)?"
 * @param verbose - If set to true, the internal commands and their outputs will be logged
 * @returns The scheduled shutdown time
 */
export async function scheduleRestart(
    duration: number | string,
    verbose: boolean = false,
): Promise<Date> {
    const minutes = parseAndValidateMinutes(duration);
    const start = Date.now();
    await getDriver(process.platform).scheduleRestart(minutes, verbose);
    return new Date(start + minutes * 60 * 1000);
}

/**
 * Cancels a previously scheduled shutdown or restart
 * @param verbose - If set to true, the internal commands and their outputs will be logged
 */
export async function cancelShutdown(verbose: boolean = false): Promise<void> {
    await getDriver(process.platform).cancelShutdown(verbose);
}

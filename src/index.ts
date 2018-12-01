import { getDriver } from './lib/drivers';
import { parseDurationPatternMinutes } from './lib/utilities';

/**
 * Schedules a shutdown after the provided duration has elapsed
 * @param duration - Number of minutes or a non-empty string matching the regular expression "(\d+h)?(\d+m)?"
 * @param verbose - If set to true, the internal command's output will be logged
 * @returns The scheduled shutdown time
 */
export async function scheduleShutdown(
    duration: number | string,
    verbose: boolean = false,
): Promise<Date> {
    const minutes = typeof duration === 'number' ? duration : parseDurationPatternMinutes(duration);
    if (minutes < 0) {
        throw new Error(`Invalid input "${duration}"`);
    }
    const start = Date.now();
    await getDriver().scheduleShutdown(minutes, verbose);
    return new Date(start + minutes * 60 * 1000);
}

/**
 * Cancels a previously scheduled shutdown
 * @param verbose - If set to true, the internal command's output will be logged
 */
export async function cancelShutdown(verbose: boolean = false): Promise<void> {
    await getDriver().cancelShutdown(verbose);
}

import { getDriver } from './lib/drivers';
import { parseDurationPatternSeconds } from './lib/utilities';

/**
 * Schedules a shutdown after the provided duration has elapsed
 * @param duration - Number of seconds or a non-empty string matching the pattern "(\d+h)?(\d+m)?(\d+s)?"
 * @returns The scheduled shutdown time
 */
export async function scheduleShutdown(duration: number | string): Promise<Date> {
    const seconds = typeof duration === 'number' ? duration : parseDurationPatternSeconds(duration);
    if (seconds < 0) {
        throw new Error(`Invalid input "${duration}"`);
    }
    const start = Date.now();
    await getDriver().scheduleShutdown(seconds);
    return new Date(start + seconds * 1000);
}

/**
 * Cancels a previously scheduled shutdown
 */
export async function cancelShutdown(): Promise<void> {
    await getDriver().cancelShutdown();
}

import yargs from 'yargs';
import { cancelShutdown, scheduleRestart, scheduleShutdown } from '../index';

let asyncHandler: (() => Promise<void>) | undefined;

yargs
    .scriptName('schedule-shutdown')
    .command<{ durationPattern: string; restart: boolean; verbose: boolean }>({
        command: '$0 <duration-pattern>',
        describe: 'Schedules a shutdown after the provided duration has elapsed',
        handler({ durationPattern, restart, verbose }) {
            asyncHandler = async () => {
                const fn = restart ? scheduleRestart : scheduleShutdown;
                const shutdownTime = await fn(durationPattern, verbose);
                const action = restart ? 'Restart' : 'Shutdown';
                const timeString = `${shutdownTime.toDateString()} ${shutdownTime.toLocaleTimeString()}`;
                console.log(`${action} scheduled for ${timeString}`);
            };
        },
    })
    .command<{ verbose: boolean }>({
        command: 'cancel',
        describe: 'Cancels a previously scheduled shutdown or restart',
        handler({ verbose }) {
            asyncHandler = async () => {
                await cancelShutdown(verbose);
                console.log('Scheduled shutdown or restart cancelled');
            };
        },
    })
    .option('restart', {
        describe: 'Schedule a restart instead of a shutdown',
        type: 'boolean',
        default: false,
    })
    .option('verbose', {
        describe: 'Log the internal commands used and their outputs',
        type: 'boolean',
        default: false,
    })
    .example('$0 5m', 'Shutdown in 5 minutes')
    .example('$0 30m', 'Shutdown in 30 minutes')
    .example('$0 1h30m', 'Shutdown in 1 hour and 30 minutes')
    .example('$0 3h', 'Shutdown in 3 hours')
    .example('$0 0m', 'Shutdown immediately')
    .example('$0 -r 2h', 'Restart in 2 hours')
    .alias({
        r: 'restart',
        h: 'help',
        v: 'version',
    });

export async function processArgs(args: string[]): Promise<void> {
    yargs.parse(args);

    if (asyncHandler) {
        const promise = asyncHandler();
        asyncHandler = undefined;
        await promise;
    }
}

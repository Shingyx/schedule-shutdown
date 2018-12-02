#!/usr/bin/env node

import yargs from 'yargs';
import { cancelShutdown, scheduleShutdown } from './index';

function onError(e: Error) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
}

try {
    yargs
        .scriptName('schedule-shutdown')
        .command({
            command: '$0 <duration-pattern>',
            describe: 'Schedules a shutdown after the provided duration has elapsed',
            async handler({ durationPattern, verbose }) {
                try {
                    const shutdownTime = await scheduleShutdown(durationPattern, verbose);
                    const timeString = `${shutdownTime.toDateString()} ${shutdownTime.toLocaleTimeString()}`;
                    console.log(`Shutdown scheduled for ${timeString}`);
                } catch (e) {
                    onError(e);
                }
            },
        })
        .command({
            command: 'cancel',
            describe: 'Cancels a previously scheduled shutdown',
            async handler({ verbose }) {
                try {
                    await cancelShutdown(verbose);
                    console.log('Shutdown cancelled');
                } catch (e) {
                    onError(e);
                }
            },
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
        .alias({
            h: 'help',
            v: 'version',
        })
        .parse();
} catch (e) {
    onError(e);
}

#!/usr/bin/env node

import yargs from 'yargs';
import { cancelShutdown, scheduleRestart, scheduleShutdown } from './index';

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
            async handler({ durationPattern, restart, verbose }) {
                try {
                    const fn = restart ? scheduleRestart : scheduleShutdown;
                    const shutdownTime = await fn(durationPattern, verbose);
                    const action = restart ? 'Restart' : 'Shutdown';
                    const timeString = `${shutdownTime.toDateString()} ${shutdownTime.toLocaleTimeString()}`;
                    console.log(`${action} scheduled for ${timeString}`);
                } catch (e) {
                    onError(e);
                }
            },
        })
        .command({
            command: 'cancel',
            describe: 'Cancels a previously scheduled shutdown or restart',
            async handler({ verbose }) {
                try {
                    await cancelShutdown(verbose);
                    console.log('Scheduled shutdown or restart cancelled');
                } catch (e) {
                    onError(e);
                }
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
        })
        .parse();
} catch (e) {
    onError(e);
}

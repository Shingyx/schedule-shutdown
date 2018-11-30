#!/usr/bin/env node

import yargs from 'yargs';
import { cancelShutdown, scheduleShutdown } from './index';

function onError(e: Error) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
}

try {
    yargs
        .command({
            command: '$0 <duration-pattern>',
            describe: 'Schedules a shutdown after the provided duration has elapsed',
            async handler({ durationPattern }) {
                try {
                    const shutdownTime = await scheduleShutdown(durationPattern);
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
            async handler() {
                try {
                    await cancelShutdown();
                    console.log('Shutdown cancelled');
                } catch (e) {
                    onError(e);
                }
            },
        })
        .example('$0 30s', 'Shutdown in 30 seconds')
        .example('$0 45m', 'Shutdown in 45 minutes')
        .example('$0 1m30s', 'Shutdown in 1 minute and 30 seconds')
        .example('$0 1h30m', 'Shutdown in 1 hour and 30 minutes')
        .example('$0 2h9s', 'Shutdown in 2 hours and 9 seconds')
        .example('$0 0s', 'Shutdown immediately')
        .alias({
            h: 'help',
            v: 'version',
        })
        .parse();
} catch (e) {
    onError(e);
}

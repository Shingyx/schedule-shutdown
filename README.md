# schedule-shutdown

[![Build Status][ci-image]][ci-url] [![Coverage Status][codecov-image]][codecov-url] [![NPM version][npm-image]][npm-url] [![Prettier][prettier-image]][prettier-url] [![License][license-image]][license-url]

_schedule-shutdown_ is a CLI tool to schedule computer shutdowns. This can be useful when:

-   You want to start a large download before you leave the computer, but you know the download will be finished well before you get back
-   You already know the command `shutdown.exe /s /t <seconds>`, but you can't be bothered converting 2 hours and 47 minutes into seconds
-   You want something to force you to go to bed at a reasonable hour

Requires Node 8 or above. Currently supports Windows, Linux, and macOS. _schedule-shutdown_ can also be used as a library.

## Usage

### CLI

Install _schedule-shutdown_ with either of the following, depending on your preferred package manager:

-   `yarn global add schedule-shutdown`
-   `npm install --global schedule-shutdown`

Then use it like so:

```console
$ schedule-shutdown --help
schedule-shutdown <duration>

Schedules a shutdown after the provided duration has elapsed

Commands:
  schedule-shutdown <duration>     Schedules a shutdown after the provided
                                   duration has elapsed                [default]
  schedule-shutdown cancel         Cancels a previously scheduled shutdown or
                                   restart

Options:
  --verbose      Log the internal commands used and their outputs
                                                      [boolean] [default: false]
  -r, --restart  Schedule a restart instead of a shutdown
                                                      [boolean] [default: false]
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]

Examples:
  schedule-shutdown 5m     Shutdown in 5 minutes
  schedule-shutdown 30m    Shutdown in 30 minutes
  schedule-shutdown 1h30m  Shutdown in 1 hour and 30 minutes
  schedule-shutdown 3h     Shutdown in 3 hours
  schedule-shutdown 0m     Shutdown immediately
  schedule-shutdown -r 2h  Restart in 2 hours

$ schedule-shutdown 1h20m
Shutdown scheduled for Tue Dec 04 2018 7:26:20 PM

$ schedule-shutdown cancel
Scheduled shutdown or restart cancelled

$ schedule-shutdown --restart 3h
Restart scheduled for Tue Dec 04 2018 9:06:30 PM

$ schedule-shutdown cancel
Scheduled shutdown or restart cancelled
```

To uninstall, do one of the following, depending on how you installed it:

-   `yarn global remove schedule-shutdown`
-   `npm uninstall --global schedule-shutdown`

### API

If you have your own project where you want to shutdown people's computers, you can use _schedule-shutdown_ as a library:

```typescript
import { cancelShutdown, scheduleRestart, scheduleShutdown } from 'schedule-shutdown';

async function main() {
    // shutdown in 1 hour and 20 minutes
    const shutdownTime = await scheduleShutdown('1h20m');
    console.log(`Shutting down at ${shutdownTime.toLocaleTimeString()}`);
    await cancelShutdown();
    console.log('Shutdown cancelled');

    // restart in 5 minutes
    const restartTime = await scheduleRestart(5);
    console.log(`Restarting at ${restartTime.toLocaleTimeString()}`);
    await cancelShutdown();
    console.log('Restart cancelled');
}

main().catch(console.error);
```

#### scheduleShutdown(duration, [verbose=false])

Schedules a shutdown after the provided duration has elapsed. The duration can be a number of minutes, or a non-empty string matching the regular expression `(\d+h)?(\d+m)?`.

Returns a promise which resolves when the shutdown is successfully scheduled. The resolved value is the scheduled shutdown time as a `Date` object. The promise will reject if the internal command failed.

If verbose is set to true, then the internal commands and their outputs will be logged to the console.

#### scheduleRestart(duration, [verbose=false])

Exactly like `scheduleShutdown(duration, [verbose=false])`, but schedules a restart instead.

#### cancelShutdown([verbose=false])

Cancels a previously scheduled shutdown or restart.

Returns a promise which resolves when the shutdown cancelled successfully. The promise will reject if the internal command failed.

If verbose is set to true, then the internal commands and their outputs will be logged to the console.

[ci-image]: https://img.shields.io/github/workflow/status/Shingyx/schedule-shutdown/Node.js%20CI/master?style=flat-square
[ci-url]: https://github.com/Shingyx/schedule-shutdown/actions?query=branch%3Amaster
[codecov-image]: https://img.shields.io/codecov/c/github/Shingyx/schedule-shutdown/master.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/Shingyx/schedule-shutdown
[npm-image]: https://img.shields.io/npm/v/schedule-shutdown.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/schedule-shutdown
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-image]: https://img.shields.io/github/license/Shingyx/schedule-shutdown.svg?style=flat-square
[license-url]: https://github.com/Shingyx/schedule-shutdown/blob/master/LICENSE.md

# schedule-shutdown

[![Build Status](https://img.shields.io/travis/com/Shingyx/schedule-shutdown/master.svg?style=flat-square)](https://travis-ci.com/Shingyx/schedule-shutdown)
[![npm](https://img.shields.io/npm/v/schedule-shutdown.svg?style=flat-square)](https://www.npmjs.com/package/schedule-shutdown)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![GitHub](https://img.shields.io/github/license/Shingyx/schedule-shutdown.svg?style=flat-square)](https://github.com/Shingyx/schedule-shutdown/blob/master/LICENSE.md)

_schedule-shutdown_ is a CLI tool to schedule computer shutdowns. This can be useful when:

-   You want to start a large download before you leave the computer, but you know the download will be finished well before you get back
-   You already know the command `shutdown.exe /s /t <seconds>`, but you can't be bothered converting 2 hours and 47 minutes into seconds
-   You want something to force you to go to bed at a reasonable hour

Requires Node 8 or above. _schedule-shutdown_ can also be used as a library.

## Usage

### CLI

Install _schedule-shutdown_ with either of the following, depending on your preferred package manager:

-   `yarn global add schedule-shutdown`
-   `npm install --global schedule-shutdown`

Then use it like so:

```console
$ schedule-shutdown --help
schedule-shutdown <duration-pattern>

Schedules a shutdown after the provided duration has elapsed

Commands:
  schedule-shutdown <duration-pattern>     Schedules a shutdown after the
                                           provided duration has elapsed
                                                                       [default]
  schedule-shutdown cancel                 Cancels a previously scheduled
                                           shutdown

Options:
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]

Examples:
  schedule-shutdown 30s    Shutdown in 30 seconds
  schedule-shutdown 45m    Shutdown in 45 minutes
  schedule-shutdown 1m30s  Shutdown in 1 minute and 30 seconds
  schedule-shutdown 1h30m  Shutdown in 1 hour and 30 minutes
  schedule-shutdown 2h9s   Shutdown in 2 hours and 9 seconds
  schedule-shutdown 0s     Shutdown immediately

$ schedule-shutdown 1h20m
Shutdown scheduled for Sat Dec 01 2018 6:56:40 PM

$ schedule-shutdown cancel
Shutdown cancelled
```

To uninstall, do one of the following, depending on how you installed it:

-   `yarn global remove schedule-shutdown`
-   `npm uninstall --global schedule-shutdown`

### API

If you have your own project where you want to shutdown people's computers, you can use _schedule-shutdown_ as a library:

```typescript
import { cancelShutdown, scheduleShutdown } from 'schedule-shutdown';

async function main() {
    let shutdownTime = await scheduleShutdown('1h20m'); // shutdown in 1 hour and 20 minutes
    console.log(`Shutting down at ${shutdownTime.toLocaleTimeString()}`);
    await cancelShutdown();
    console.log('Shutdown cancelled');

    shutdownTime = await scheduleShutdown(60); // shutdown in 60 seconds
    console.log(`Actually, shutting down at ${shutdownTime.toLocaleTimeString()}`);
    await cancelShutdown();
    console.log('Shutdown cancelled again');
}

main().catch(console.error);
```

#### scheduleShutdown(duration)

Schedules a shutdown after the provided duration has elapsed. The duration can be a number of seconds, or a non-empty string matching the regular expression `(\d+h)?(\d+m)?(\d+s)?`.

Returns a promise which resolves when the shutdown is successfully scheduled. The resolved value is the scheduled shutdown time as a `Date` object. The promise will reject if the internal command failed.

#### cancelShutdown()

Cancels a previously scheduled shutdown.

Returns a promise which resolves when the shutdown cancelled successfully. The promise will reject if the internal command failed.

## Future Improvements

-   Support more platforms
-   Schedule restarts or sleeps

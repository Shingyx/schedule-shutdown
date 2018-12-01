import childProcess from 'child_process';
import { promisify } from 'util';

const execFile = promisify(childProcess.execFile);

export interface IDriver {
    scheduleShutdown(seconds: number): Promise<void>;
    cancelShutdown(): Promise<void>;
}

let driver: IDriver | undefined;

switch (process.platform) {
    case 'win32':
        driver = getWindowsDriver();
        break;
}

export function getDriver(): IDriver {
    if (!driver) {
        throw new Error(`Your platform "${process.platform}" is not supported`);
    }
    return driver;
}

function getWindowsDriver(): IDriver {
    return {
        async scheduleShutdown(seconds: number): Promise<void> {
            await execFile('shutdown.exe', ['/s', '/t', seconds.toString()]);
        },
        async cancelShutdown(): Promise<void> {
            await execFile('shutdown.exe', ['/a']);
        },
    };
}

import { execFile } from 'child_process';
import { promisify } from 'util';

export interface IDriver {
    scheduleShutdown(minutes: number, verbose: boolean): Promise<void>;
    cancelShutdown(verbose: boolean): Promise<void>;
}

let driver: IDriver | undefined;

switch (process.platform) {
    case 'linux':
        driver = getLinuxDriver();
        break;
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

function getLinuxDriver(): IDriver {
    return {
        async scheduleShutdown(minutes: number, verbose: boolean): Promise<void> {
            await execHelper('shutdown', ['-h', `+${minutes}`], verbose);
        },
        async cancelShutdown(verbose: boolean): Promise<void> {
            await execHelper('shutdown', ['-c'], verbose);
        },
    };
}

function getWindowsDriver(): IDriver {
    return {
        async scheduleShutdown(minutes: number, verbose: boolean): Promise<void> {
            const seconds = minutes * 60;
            await execHelper('shutdown.exe', ['/s', '/t', seconds.toString()], verbose);
        },
        async cancelShutdown(verbose: boolean): Promise<void> {
            await execHelper('shutdown.exe', ['/a'], verbose);
        },
    };
}

async function execHelper(file: string, args: string[], verbose: boolean): Promise<void> {
    if (verbose) {
        console.log(`executing: ${[file, ...args].join(' ')}`);
    }
    const { stdout, stderr } = await promisify(execFile)(file, args);
    const output = (stdout || stderr).trim();
    if (verbose) {
        console.log(`output: ${output || '[no output]'}`);
    }
}

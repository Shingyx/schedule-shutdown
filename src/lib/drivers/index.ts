import linux from './linux';
import win32 from './win32';

export interface IDriver {
    scheduleShutdown(minutes: number, verbose: boolean): Promise<void>;
    cancelShutdown(verbose: boolean): Promise<void>;
}

const supportedDrivers: { [platform: string]: IDriver | undefined } = {
    linux,
    win32,
};

const driver = supportedDrivers[process.platform];

export function getDriver(): IDriver {
    if (!driver) {
        throw new Error(`Your platform "${process.platform}" is not supported`);
    }
    return driver;
}

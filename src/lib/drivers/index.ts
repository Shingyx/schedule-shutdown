import linux from './linux';
import win32 from './win32';

export interface IDriver {
    scheduleShutdown(minutes: number, verbose: boolean): Promise<void>;
    scheduleRestart(minutes: number, verbose: boolean): Promise<void>;
    cancelShutdown(verbose: boolean): Promise<void>;
}

const supportedDrivers: { [platform: string]: IDriver | undefined } = {
    linux,
    win32,
};

export function getDriver(platform: NodeJS.Platform): IDriver {
    const driver = supportedDrivers[platform];
    if (!driver) {
        throw new Error(`Your platform "${platform}" is not supported`);
    }
    return driver;
}

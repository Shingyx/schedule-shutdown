import { execHelper } from '../utilities';
import { IDriver } from './index';

const linux: IDriver = {
    async scheduleShutdown(minutes: number, verbose: boolean): Promise<void> {
        await execHelper('shutdown', [`+${minutes}`], verbose);
    },
    async scheduleRestart(minutes: number, verbose: boolean): Promise<void> {
        await execHelper('shutdown', ['-r', `+${minutes}`], verbose);
    },
    async cancelShutdown(verbose: boolean): Promise<void> {
        await execHelper('shutdown', ['-c'], verbose);
    },
};

export default linux;

import { detachedSpawnHelper, execHelper } from '../utilities';
import { IDriver } from './index';

const darwin: IDriver = {
    async scheduleShutdown(minutes: number, verbose: boolean): Promise<void> {
        const seconds = minutes * 60;
        await detachedSpawnHelper(
            'osascript',
            ['-e', `delay ${seconds}`, '-e', 'tell app "System Events" to shut down'],
            verbose,
        );
    },
    async scheduleRestart(minutes: number, verbose: boolean): Promise<void> {
        const seconds = minutes * 60;
        await detachedSpawnHelper(
            'osascript',
            ['-e', `delay ${seconds}`, '-e', 'tell app "System Events" to restart'],
            verbose,
        );
    },
    async cancelShutdown(verbose: boolean): Promise<void> {
        await execHelper(
            'pkill',
            ['-f', 'osascript -e delay [0-9]+ -e tell app "System Events" to (shut down|restart)'],
            verbose,
        );
    },
};

export default darwin;

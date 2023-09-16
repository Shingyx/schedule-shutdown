import { execHelper } from '../utilities';
import { IDriver } from './index';

const win32: IDriver = {
  async scheduleShutdown(minutes: number, verbose: boolean): Promise<void> {
    const seconds = minutes * 60;
    await execHelper('shutdown.exe', ['/s', '/t', seconds.toString()], verbose);
  },
  async scheduleRestart(minutes: number, verbose: boolean): Promise<void> {
    const seconds = minutes * 60;
    await execHelper('shutdown.exe', ['/r', '/t', seconds.toString()], verbose);
  },
  async cancelShutdown(verbose: boolean): Promise<void> {
    await execHelper('shutdown.exe', ['/a'], verbose);
  },
};

export default win32;

import { execFile, spawn } from 'child_process';
import { promisify } from 'util';

export function parseDurationStringMinutes(pattern: string): number {
    const durationMatch = /^(\d+h)?(\d+m)?$/.exec(pattern);
    if (!durationMatch || !durationMatch.input) {
        return -1;
    }
    let minutes = 0;
    for (let i = 1; i < durationMatch.length; i++) {
        const match = durationMatch[i];
        if (!match) {
            continue;
        }
        let value = Number(match.slice(0, -1));
        const unit = match.slice(-1);
        if (unit !== 'm') {
            value *= 60;
        }
        minutes += value;
    }
    return minutes;
}

export function parseAndValidateMinutes(duration: number | string): number {
    const minutes = typeof duration === 'number' ? duration : parseDurationStringMinutes(duration);
    if (minutes < 0) {
        throw new Error(`Invalid input "${duration}"`);
    }
    return minutes;
}

export async function execHelper(file: string, args: string[], verbose: boolean): Promise<void> {
    if (verbose) {
        console.log(`executing: ${[file, ...args].join(' ')}`);
    }
    const result = await promisify(execFile)(file, args);
    if (verbose) {
        const output = `${result.stdout.trim()}\n${result.stderr.trim()}`;
        console.log(`output: ${output.trim() || '[no output]'}`);
    }
}

export function detachedSpawnHelper(command: string, args: string[], verbose: boolean): void {
    if (verbose) {
        console.log(`spawning in background: ${[command, ...args].join(' ')}`);
    }
    const subprocess = spawn(command, args, { detached: true, stdio: 'ignore' });
    subprocess.unref();
    if (verbose) {
        console.log(`started process ${subprocess.pid}`);
    }
}

import { execFile } from 'child_process';
import { readFile } from 'fs';
import { promisify } from 'util';

test('--help', async () => {
    const stdout = await execScheduleShutdown('--help');
    expect(stdout).toContain('Commands:');
    expect(stdout).toContain('Options:');
    expect(stdout).toContain('Examples:');
});

test('--version', async () => {
    const stdout = await execScheduleShutdown('--version');
    const { version } = JSON.parse(await promisify(readFile)('package.json', 'utf-8'));
    expect(stdout).toBe(version);
});

test('no arguments', async () => {
    try {
        await execScheduleShutdown();
        fail();
    } catch (e) {
        expect(e.stderr).toContain('Options:');
        expect(e.code).toBe(1);
    }
});

async function execScheduleShutdown(...args: string[]): Promise<string> {
    const { stdout } = await promisify(execFile)(process.execPath, ['dist/cli.js', ...args]);
    return stdout.trim();
}

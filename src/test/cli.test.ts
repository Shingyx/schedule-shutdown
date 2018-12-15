import { assert } from 'chai';
import { execFile } from 'child_process';
import { readFile } from 'fs';
import { promisify } from 'util';

describe('cli', () => {
    it('--help', async () => {
        const stdout = await execScheduleShutdown('--help');
        assert.include(stdout, 'Commands:');
        assert.include(stdout, 'Options:');
        assert.include(stdout, 'Examples:');
    });

    it('--version', async () => {
        const stdout = await execScheduleShutdown('--version');
        const { version } = JSON.parse(await promisify(readFile)('package.json', 'utf-8'));
        assert.strictEqual(stdout, version);
    });

    it('no arguments', async () => {
        await execScheduleShutdown().then(
            () => assert.fail(),
            (e) => {
                assert.include(e.stderr, 'Options:');
                assert.strictEqual(e.code, 1);
            },
        );
    });

    it('invalid arguments', async () => {
        await execScheduleShutdown('hello').then(
            () => assert.fail(),
            (e) => {
                assert.include(e.stderr, 'Error: Invalid input');
                assert.strictEqual(e.code, 1);
            },
        );
    });

    async function execScheduleShutdown(...args: string[]): Promise<string> {
        const { stdout } = await promisify(execFile)(process.execPath, ['dist/cli.js', ...args]);
        return stdout.trim();
    }
});

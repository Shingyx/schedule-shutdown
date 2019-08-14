import { assert } from 'chai';
import childProcess, { execFile } from 'child_process';
import sinon from 'sinon';
import util from 'util';
import {
    detachedSpawnHelper,
    execHelper,
    parseAndValidateMinutes,
    parseDurationStringMinutes,
} from '../../lib/utilities';

describe('lib/utilities', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('parseDurationStringMinutes', () => {
        it('0m returns 0', () => {
            assert.strictEqual(parseDurationStringMinutes('0m'), 0);
        });

        it('0h returns 0', () => {
            assert.strictEqual(parseDurationStringMinutes('0h'), 0);
        });

        it('0h0m returns 0', () => {
            assert.strictEqual(parseDurationStringMinutes('0h0m'), 0);
        });

        it('5m returns 5', () => {
            assert.strictEqual(parseDurationStringMinutes('5m'), 5);
        });

        it('12m returns 12', () => {
            assert.strictEqual(parseDurationStringMinutes('12m'), 12);
        });

        it('321m returns 321', () => {
            assert.strictEqual(parseDurationStringMinutes('321m'), 321);
        });

        it('5h returns 300', () => {
            assert.strictEqual(parseDurationStringMinutes('5h'), 300);
        });

        it('5h10m returns 310', () => {
            assert.strictEqual(parseDurationStringMinutes('5h10m'), 310);
        });

        it('1h60m returns 120', () => {
            assert.strictEqual(parseDurationStringMinutes('1h60m'), 120);
        });

        describe('invalid values', () => {
            const invalidValues: any[] = [
                '',
                'hello world',
                '1s2s',
                '2m3m3s',
                '3s2m1h',
                [],
                [8],
                {},
                { a: 'b' },
                0,
                6,
                -1,
            ];

            for (const value of invalidValues) {
                it(`${JSON.stringify(value)} returns -1`, () => {
                    assert.strictEqual(parseDurationStringMinutes(value), -1);
                });
            }
        });
    });

    describe('parseAndValidateMinutes', () => {
        it('0 returns 0', () => {
            assert.strictEqual(parseAndValidateMinutes(0), 0);
        });

        it('5 returns 5', () => {
            assert.strictEqual(parseAndValidateMinutes(5), 5);
        });

        it('"0m" returns 0', () => {
            assert.strictEqual(parseAndValidateMinutes('0m'), 0);
        });

        it('"5m" returns 5', () => {
            assert.strictEqual(parseAndValidateMinutes('5m'), 5);
        });

        it('"1h" returns 60', () => {
            assert.strictEqual(parseAndValidateMinutes('1h'), 60);
        });

        it('-1 throws', () => {
            assert.throws(() => parseAndValidateMinutes(-1));
        });

        it('"hello world" throws', () => {
            assert.throws(() => parseAndValidateMinutes('hello world'));
        });
    });

    describe('execHelper', () => {
        let consoleLogSpy: sinon.SinonSpy<[...any[]], void>;

        beforeEach(() => {
            consoleLogSpy = sandbox.spy(console, 'log');
        });

        it('arguments are passed to execFile as is', async () => {
            const file = 'shutdown.exe';
            const args = ['/s', '/t', '0'];
            mockPromisifiedExecFile(file, args);
            await execHelper(file, args, false);
            assert.deepEqual(consoleLogSpy.args, []);
        });

        it('reject if execFile rejects', async () => {
            const file = 'shutdown.exe';
            const args = ['/a'];
            const errorMessage =
                'Error: Command failed: shutdown.exe /a\nUnable to abort the system shutdown because no shutdown was in progress.\n';
            mockPromisifiedExecFile(file, args, { errorMessage });
            await execHelper(file, args, false).then(
                () => assert.fail(),
                (e) => {
                    assert.strictEqual(e.message, errorMessage);
                    assert.deepEqual(consoleLogSpy.args, []);
                },
            );
        });

        describe('verbose enabled', () => {
            it('log [no output] when stdout and stderr is empty', async () => {
                const file = 'shutdown.exe';
                const args = ['/s', '/t', '0'];
                mockPromisifiedExecFile(file, args);
                await execHelper(file, args, true);
                assert.deepEqual(consoleLogSpy.args, [
                    ['executing: shutdown.exe /s /t 0'],
                    ['output: [no output]'],
                ]);
            });

            it('log stdout output if present', async () => {
                const file = 'echo';
                const args = ['hello world'];
                mockPromisifiedExecFile(file, args, { stdout: 'hello world\n' });
                await execHelper(file, args, true);
                assert.deepEqual(consoleLogSpy.args, [
                    ['executing: echo hello world'],
                    ['output: hello world'],
                ]);
            });

            it('log stderr output if present', async () => {
                const file = 'shutdown';
                const args = ['+3600'];
                mockPromisifiedExecFile(file, args, {
                    stderr:
                        "Shutdown scheduled for Thu 2018-12-06 16:24:26 NZDT, use 'shutdown -c' to cancel.\n",
                });
                await execHelper(file, args, true);
                assert.deepEqual(consoleLogSpy.args, [
                    ['executing: shutdown +3600'],
                    [
                        "output: Shutdown scheduled for Thu 2018-12-06 16:24:26 NZDT, use 'shutdown -c' to cancel.",
                    ],
                ]);
            });

            it('log stdout and stderr output if present', async () => {
                const file = 'some';
                const args = ['command'];
                mockPromisifiedExecFile(file, args, {
                    stdout: 'hello world\n',
                    stderr: 'goodbye world',
                });
                await execHelper(file, args, true);
                assert.deepEqual(consoleLogSpy.args, [
                    ['executing: some command'],
                    ['output: hello world\ngoodbye world'],
                ]);
            });

            it('log stdout for executing command and reject if execFile rejects', async () => {
                const file = 'shutdown.exe';
                const args = ['/a'];
                const errorMessage =
                    'Error: Command failed: shutdown.exe /a\nUnable to abort the system shutdown because no shutdown was in progress.\n';
                mockPromisifiedExecFile(file, args, { errorMessage });
                await execHelper(file, args, true).then(
                    () => assert.fail(),
                    (e) => {
                        assert.strictEqual(e.message, errorMessage);
                        assert.deepEqual(consoleLogSpy.args, [['executing: shutdown.exe /a']]);
                    },
                );
            });
        });

        function mockPromisifiedExecFile(
            expectedFile: string,
            expectedArgs: string[],
            options: {
                stdout?: string;
                stderr?: string;
                errorMessage?: string;
            } = {},
        ): void {
            sandbox
                .stub(util, 'promisify')
                .withArgs(execFile)
                .callsFake(() => async (...fnArgs: any[]) => {
                    assert.deepEqual(fnArgs, [expectedFile, expectedArgs]);
                    if (options.errorMessage) {
                        throw new Error(options.errorMessage);
                    }
                    return {
                        stdout: options.stdout || '',
                        stderr: options.stderr || '',
                    };
                });
        }
    });

    describe('detachedSpawnHelper', () => {
        let consoleLogSpy: sinon.SinonSpy<[...any[]], void>;

        beforeEach(() => {
            consoleLogSpy = sandbox.spy(console, 'log');
        });

        it('arguments are passed to spawn as is', () => {
            const command = 'echo.exe';
            const args = ['Hello', 'world!'];
            const pid = 1234;
            mockSpawn(command, args, pid);
            detachedSpawnHelper(command, args, false);
            assert.deepEqual(consoleLogSpy.args, []);
        });

        it('verbose enabled', () => {
            const command = 'echo.exe';
            const args = ['Hello', 'world!'];
            const pid = 9001;
            mockSpawn(command, args, pid);
            detachedSpawnHelper(command, args, true);
            assert.deepEqual(consoleLogSpy.args, [
                ['spawning in background: echo.exe Hello world!'],
                [`started process ${pid}`],
            ]);
        });

        function mockSpawn(expectedCommand: string, expectedArgs: string[], pid: number): void {
            sandbox.stub(childProcess, 'spawn').callsFake((...fnArgs) => {
                assert.deepEqual(fnArgs, [
                    expectedCommand,
                    expectedArgs,
                    { detached: true, stdio: 'ignore' },
                ]);
                const unref = () => {}; // tslint:disable-line:no-empty
                return { pid, unref } as any;
            });
        }
    });
});

import { execFile } from 'child_process';
import util from 'util';
import {
    execHelper,
    parseAndValidateMinutes,
    parseDurationPatternMinutes,
} from '../../lib/utilities';

describe('parseDurationPatternMinutes', () => {
    test('0m returns 0', () => {
        expect(parseDurationPatternMinutes('0m')).toBe(0);
    });

    test('0h returns 0', () => {
        expect(parseDurationPatternMinutes('0h')).toBe(0);
    });

    test('0h0m returns 0', () => {
        expect(parseDurationPatternMinutes('0h0m')).toBe(0);
    });

    test('5m returns 5', () => {
        expect(parseDurationPatternMinutes('5m')).toBe(5);
    });

    test('12m returns 12', () => {
        expect(parseDurationPatternMinutes('12m')).toBe(12);
    });

    test('321m returns 321', () => {
        expect(parseDurationPatternMinutes('321m')).toBe(321);
    });

    test('5h returns 300', () => {
        expect(parseDurationPatternMinutes('5h')).toBe(300);
    });

    test('5h10m returns 310', () => {
        expect(parseDurationPatternMinutes('5h10m')).toBe(310);
    });

    test('1h60m returns 120', () => {
        expect(parseDurationPatternMinutes('1h60m')).toBe(120);
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
            test(`${JSON.stringify(value)} returns -1`, () => {
                expect(parseDurationPatternMinutes(value)).toBe(-1);
            });
        }
    });
});

describe('parseAndValidateMinutes', () => {
    test('0 returns 0', () => {
        expect(parseAndValidateMinutes(0)).toBe(0);
    });

    test('5 returns 5', () => {
        expect(parseAndValidateMinutes(5)).toBe(5);
    });

    test('"0m" returns 0', () => {
        expect(parseAndValidateMinutes('0m')).toBe(0);
    });

    test('"5m" returns 5', () => {
        expect(parseAndValidateMinutes('5m')).toBe(5);
    });

    test('"1h" returns 60', () => {
        expect(parseAndValidateMinutes('1h')).toBe(60);
    });

    test('-1 throws', () => {
        expect(() => parseAndValidateMinutes(-1)).toThrow();
    });

    test('"hello world" throws', () => {
        expect(() => parseAndValidateMinutes('hello world')).toThrow();
    });
});

describe('execHelper', () => {
    let consoleLogSpy: jest.MockContext<typeof console.log>;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, 'log').mock;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('arguments are passed to execFile as is', async () => {
        const file = 'shutdown.exe';
        const args = ['/s', '/t', '0'];
        mockPromisifiedExecFile(file, args);
        await execHelper(file, args, false);
        expect(consoleLogSpy.calls).toMatchObject([]);
    });

    test('reject if execFile rejects', async () => {
        const file = 'shutdown.exe';
        const args = ['/a'];
        const errorMessage =
            'Error: Command failed: shutdown.exe /a\nUnable to abort the system shutdown because no shutdown was in progress.\n';
        mockPromisifiedExecFile(file, args, { errorMessage });
        await expect(execHelper(file, args, false)).rejects.toThrow(errorMessage);
        expect(consoleLogSpy.calls).toMatchObject([]);
    });

    describe('verbose enabled', () => {
        test('log [no output] when stdout and stderr is empty', async () => {
            const file = 'shutdown.exe';
            const args = ['/s', '/t', '0'];
            mockPromisifiedExecFile(file, args);
            await execHelper(file, args, true);
            expect(consoleLogSpy.calls).toMatchObject([
                ['executing: shutdown.exe /s /t 0'],
                ['output: [no output]'],
            ]);
        });

        test('log stdout output if present', async () => {
            const file = 'echo';
            const args = ['hello world'];
            mockPromisifiedExecFile(file, args, { stdout: 'hello world\n' });
            await execHelper(file, args, true);
            expect(consoleLogSpy.calls).toMatchObject([
                ['executing: echo hello world'],
                ['output: hello world'],
            ]);
        });

        test('log stderr output if present', async () => {
            const file = 'shutdown';
            const args = ['+3600'];
            mockPromisifiedExecFile(file, args, {
                stderr:
                    "Shutdown scheduled for Thu 2018-12-06 16:24:26 NZDT, use 'shutdown -c' to cancel.\n",
            });
            await execHelper(file, args, true);
            expect(consoleLogSpy.calls).toMatchObject([
                ['executing: shutdown +3600'],
                [
                    "output: Shutdown scheduled for Thu 2018-12-06 16:24:26 NZDT, use 'shutdown -c' to cancel.",
                ],
            ]);
        });

        test('log stdout and stderr output if present', async () => {
            const file = 'some';
            const args = ['command'];
            mockPromisifiedExecFile(file, args, {
                stdout: 'hello world\n',
                stderr: 'goodbye world',
            });
            await execHelper(file, args, true);
            expect(consoleLogSpy.calls).toMatchObject([
                ['executing: some command'],
                ['output: hello world\ngoodbye world'],
            ]);
        });

        test('log stdout for executing command and reject if execFile rejects', async () => {
            const file = 'shutdown.exe';
            const args = ['/a'];
            const errorMessage =
                'Error: Command failed: shutdown.exe /a\nUnable to abort the system shutdown because no shutdown was in progress.\n';
            mockPromisifiedExecFile(file, args, { errorMessage });
            await expect(execHelper(file, args, true)).rejects.toThrow(errorMessage);
            expect(consoleLogSpy.calls).toMatchObject([['executing: shutdown.exe /a']]);
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
        jest.spyOn(util, 'promisify').mockImplementation((fn) => {
            expect(fn).toBe(execFile);

            return async (...fnArgs: any[]) => {
                expect(fnArgs).toEqual([expectedFile, expectedArgs]);
                if (options.errorMessage) {
                    throw new Error(options.errorMessage);
                }
                return {
                    stdout: options.stdout || '',
                    stderr: options.stderr || '',
                };
            };
        });
    }
});

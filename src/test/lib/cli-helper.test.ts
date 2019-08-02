import { assert } from 'chai';
import sinon from 'sinon';
import * as index from '../../index';
import { processArgs } from '../../lib/cli-helper';
import * as utilities from '../../lib/utilities';

describe('lib/cli-helper', () => {
    const sandbox = sinon.createSandbox();
    let scheduleShutdownSpy: sinon.SinonSpy<[number | string, boolean?], Promise<Date>>;
    let scheduleRestartSpy: sinon.SinonSpy<[number | string, boolean?], Promise<Date>>;
    let cancelShutdownSpy: sinon.SinonSpy<[boolean?], Promise<void>>;

    beforeEach(() => {
        scheduleShutdownSpy = sandbox.spy(index, 'scheduleShutdown');
        scheduleRestartSpy = sandbox.spy(index, 'scheduleRestart');
        cancelShutdownSpy = sandbox.spy(index, 'cancelShutdown');

        // don't actually shutdown
        sandbox.stub(utilities, 'execHelper').resolves();
        sandbox.stub(utilities, 'detachedSpawnHelper').resolves();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('processArgs', () => {
        it('1h20m', async () => {
            await runTest(['1h20m'], { scheduleShutdown: ['1h20m', false] });
        });

        it('--verbose 10m', async () => {
            await runTest(['--verbose', '10m'], { scheduleShutdown: ['10m', true] });
        });

        it('3h --verbose', async () => {
            await runTest(['3h', '--verbose'], { scheduleShutdown: ['3h', true] });
        });

        it('--restart 1h20m', async () => {
            await runTest(['--restart', '1h20m'], { scheduleRestart: ['1h20m', false] });
        });

        it('5m -r --verbose', async () => {
            await runTest(['5m', '-r', '--verbose'], { scheduleRestart: ['5m', true] });
        });

        it('cancel', async () => {
            await runTest(['cancel'], { cancelShutdown: [false] });
        });

        it('--verbose cancel', async () => {
            await runTest(['--verbose', 'cancel'], { cancelShutdown: [true] });
        });

        it('--version', async () => {
            await runTest(['--version'], {});
        });

        it('-v', async () => {
            await runTest(['-v'], {});
        });

        it('--help', async () => {
            await runTest(['--help'], {});
        });

        it('-h', async () => {
            await runTest(['-h'], {});
        });

        it('-1m fails', async () => {
            await runTest(['-1m'], { scheduleShutdown: ['-1m', false] }, false);
        });

        it('hello world fails', async () => {
            await runTest(['hello', 'world'], {}, false);
        });

        it('unknown argument fails', async () => {
            await runTest(['--unknown'], {}, false);
        });

        async function runTest(
            args: string[],
            calls: {
                scheduleShutdown?: any[];
                scheduleRestart?: any[];
                cancelShutdown?: any[];
            },
            expectSuccess: boolean = true,
        ): Promise<void> {
            let exitError: Error | undefined;
            sandbox.stub(process, 'exit').callsFake(((code?: number) => {
                if (code) {
                    exitError = new Error(`exit code ${code}`);
                }
            }) as any);

            if (expectSuccess) {
                await processArgs(args);
            } else {
                await processArgs(args).then(
                    () => assert.isDefined(exitError),
                    (fnError) => assert.isDefined(fnError),
                );
            }

            const actualCalls = {
                scheduleShutdown: scheduleShutdownSpy.args,
                scheduleRestart: scheduleRestartSpy.args,
                cancelShutdown: cancelShutdownSpy.args,
            };
            const expectedCalls = {
                scheduleShutdown: calls.scheduleShutdown ? [calls.scheduleShutdown] : [],
                scheduleRestart: calls.scheduleRestart ? [calls.scheduleRestart] : [],
                cancelShutdown: calls.cancelShutdown ? [calls.cancelShutdown] : [],
            };
            assert.deepEqual(actualCalls, expectedCalls);
        }
    });
});

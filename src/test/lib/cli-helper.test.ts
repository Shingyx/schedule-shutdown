import { assert } from 'chai';
import sinon from 'sinon';
import * as index from '../../index';
import { processArgs } from '../../lib/cli-helper';
import * as utilities from '../../lib/utilities';

describe('lib/cli-helper', () => {
    const sandbox = sinon.createSandbox();
    let scheduleShutdownSpy: sinon.SinonSpy;
    let scheduleRestartSpy: sinon.SinonSpy;
    let cancelShutdownSpy: sinon.SinonSpy;

    beforeEach(() => {
        scheduleShutdownSpy = sandbox.spy(index, 'scheduleShutdown');
        scheduleRestartSpy = sandbox.spy(index, 'scheduleRestart');
        cancelShutdownSpy = sandbox.spy(index, 'cancelShutdown');

        // don't actually shutdown
        sandbox.stub(utilities, 'execHelper').resolves();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('processArgs', () => {
        it('1h20m', async () => {
            await processArgs(['1h20m']);
            assertCalls({ scheduleShutdown: ['1h20m', false] });
        });

        it('--verbose 10m', async () => {
            await processArgs(['--verbose', '10m']);
            assertCalls({ scheduleShutdown: ['10m', true] });
        });

        it('3h --verbose', async () => {
            await processArgs(['3h', '--verbose']);
            assertCalls({ scheduleShutdown: ['3h', true] });
        });

        it('--restart 1h20m', async () => {
            await processArgs(['--restart', '1h20m']);
            assertCalls({ scheduleRestart: ['1h20m', false] });
        });

        it('5m -r --verbose', async () => {
            await processArgs(['5m', '-r', '--verbose']);
            assertCalls({ scheduleRestart: ['5m', true] });
        });

        it('cancel', async () => {
            await processArgs(['cancel']);
            assertCalls({ cancelShutdown: [false] });
        });

        it('--verbose cancel', async () => {
            await processArgs(['--verbose', 'cancel']);
            assertCalls({ cancelShutdown: [true] });
        });

        it('--version', async () => {
            await processArgs(['--version']);
            assertCalls({});
        });

        it('-v', async () => {
            await processArgs(['-v']);
            assertCalls({});
        });

        it('--help', async () => {
            await processArgs(['--help']);
            assertCalls({});
        });

        it('-h', async () => {
            await processArgs(['-h']);
            assertCalls({});
        });

        it('-1m fails', async () => {
            await processArgs(['-1m']).then(
                () => assert.fail(),
                () => {
                    assertCalls({ scheduleShutdown: ['-1m', false] });
                },
            );
        });

        it('hello world fails', async () => {
            await processArgs(['hello', 'world']).then(
                () => assert.fail(),
                () => {
                    assertCalls({ scheduleShutdown: ['hello', false] });
                },
            );
        });

        it('unknown argument fails', async () => {
            await processArgs(['--unknown']).then(
                () => assert.fail(),
                () => {
                    assertCalls({});
                },
            );
        });

        function assertCalls(calls: {
            scheduleShutdown?: any[];
            scheduleRestart?: any[];
            cancelShutdown?: any[];
        }): void {
            const actual = {
                scheduleShutdown: scheduleShutdownSpy.args,
                scheduleRestart: scheduleRestartSpy.args,
                cancelShutdown: cancelShutdownSpy.args,
            };
            const expected = {
                scheduleShutdown: calls.scheduleShutdown ? [calls.scheduleShutdown] : [],
                scheduleRestart: calls.scheduleRestart ? [calls.scheduleRestart] : [],
                cancelShutdown: calls.cancelShutdown ? [calls.cancelShutdown] : [],
            };
            assert.deepEqual(actual, expected);
        }
    });
});

import * as index from '../../index';
import { processArgs } from '../../lib/cli-helper';
import * as utilities from '../../lib/utilities';

let scheduleShutdownMock: jest.MockContext<typeof index.scheduleShutdown>;
let scheduleRestartMock: jest.MockContext<typeof index.scheduleRestart>;
let cancelShutdownMock: jest.MockContext<typeof index.cancelShutdown>;

beforeEach(() => {
    scheduleShutdownMock = jest.spyOn(index, 'scheduleShutdown').mock;
    scheduleRestartMock = jest.spyOn(index, 'scheduleRestart').mock;
    cancelShutdownMock = jest.spyOn(index, 'cancelShutdown').mock;

    // don't actually shutdown
    jest.spyOn(utilities, 'execHelper').mockResolvedValue(undefined);
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('processArgs', () => {
    test('1h20m', async () => {
        await processArgs(['1h20m']);
        assertCalls({ scheduleShutdown: ['1h20m', false] });
    });

    test('--verbose 10m', async () => {
        await processArgs(['--verbose', '10m']);
        assertCalls({ scheduleShutdown: ['10m', true] });
    });

    test('3h --verbose', async () => {
        await processArgs(['3h', '--verbose']);
        assertCalls({ scheduleShutdown: ['3h', true] });
    });

    test('--restart 1h20m', async () => {
        await processArgs(['--restart', '1h20m']);
        assertCalls({ scheduleRestart: ['1h20m', false] });
    });

    test('5m -r --verbose', async () => {
        await processArgs(['5m', '-r', '--verbose']);
        assertCalls({ scheduleRestart: ['5m', true] });
    });

    test('cancel', async () => {
        await processArgs(['cancel']);
        assertCalls({ cancelShutdown: [false] });
    });

    test('--verbose cancel', async () => {
        await processArgs(['--verbose', 'cancel']);
        assertCalls({ cancelShutdown: [true] });
    });

    test('--version', async () => {
        await processArgs(['--version']);
        assertCalls({});
    });

    test('-v', async () => {
        await processArgs(['-v']);
        assertCalls({});
    });

    test('--help', async () => {
        await processArgs(['--help']);
        assertCalls({});
    });

    test('-h', async () => {
        await processArgs(['-h']);
        assertCalls({});
    });

    test('-1m fails', async () => {
        await expect(processArgs(['-1m'])).rejects.toThrow();
        assertCalls({ scheduleShutdown: ['-1m', false] });
    });

    test('hello world fails', async () => {
        await expect(processArgs(['hello', 'world'])).rejects.toThrow();
        assertCalls({ scheduleShutdown: ['hello', false] });
    });

    test('unknown argument fails', async () => {
        await expect(processArgs(['--unknown'])).rejects.toThrow();
        assertCalls({});
    });

    function assertCalls(calls: {
        scheduleShutdown?: any[];
        scheduleRestart?: any[];
        cancelShutdown?: any[];
    }): void {
        const actual = {
            scheduleShutdown: scheduleShutdownMock.calls,
            scheduleRestart: scheduleRestartMock.calls,
            cancelShutdown: cancelShutdownMock.calls,
        };
        const expected = {
            scheduleShutdown: calls.scheduleShutdown ? [calls.scheduleShutdown] : [],
            scheduleRestart: calls.scheduleRestart ? [calls.scheduleRestart] : [],
            cancelShutdown: calls.cancelShutdown ? [calls.cancelShutdown] : [],
        };
        expect(actual).toMatchObject(expected);
    }
});

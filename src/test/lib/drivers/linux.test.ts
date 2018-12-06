import linux from '../../../lib/drivers/linux';
import * as utilities from '../../../lib/utilities';

let execHelperMock: jest.MockContext<typeof utilities.execHelper>;

beforeEach(() => {
    execHelperMock = jest.spyOn(utilities, 'execHelper').mockResolvedValue(undefined).mock;
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('scheduleShutdown', () => {
    test('correct command when input is 0', async () => {
        await linux.scheduleShutdown(0, false);
        expect(execHelperMock.calls).toEqual([['shutdown', ['+0'], false]]);
    });

    test('correct command when input is 1', async () => {
        await linux.scheduleShutdown(1, false);
        expect(execHelperMock.calls).toEqual([['shutdown', ['+1'], false]]);
    });

    test('correct command when input is 67', async () => {
        await linux.scheduleShutdown(67, false);
        expect(execHelperMock.calls).toEqual([['shutdown', ['+67'], false]]);
    });

    test('verbose option is passed through', async () => {
        await linux.scheduleShutdown(0, true);
        expect(execHelperMock.calls).toEqual([['shutdown', ['+0'], true]]);
    });
});

describe('scheduleRestart', () => {
    test('correct command when input is 0', async () => {
        await linux.scheduleRestart(0, false);
        expect(execHelperMock.calls).toEqual([['shutdown', ['-r', '+0'], false]]);
    });

    test('correct command when input is 1', async () => {
        await linux.scheduleRestart(1, false);
        expect(execHelperMock.calls).toEqual([['shutdown', ['-r', '+1'], false]]);
    });

    test('correct command when input is 67', async () => {
        await linux.scheduleRestart(67, false);
        expect(execHelperMock.calls).toEqual([['shutdown', ['-r', '+67'], false]]);
    });

    test('verbose option is passed through', async () => {
        await linux.scheduleRestart(0, true);
        expect(execHelperMock.calls).toEqual([['shutdown', ['-r', '+0'], true]]);
    });
});

describe('cancelShutdown', () => {
    test('correct command', async () => {
        await linux.cancelShutdown(false);
        expect(execHelperMock.calls).toEqual([['shutdown', ['-c'], false]]);
    });

    test('verbose option is passed through', async () => {
        await linux.cancelShutdown(true);
        expect(execHelperMock.calls).toEqual([['shutdown', ['-c'], true]]);
    });
});

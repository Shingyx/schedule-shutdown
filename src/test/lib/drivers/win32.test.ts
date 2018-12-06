import win32 from '../../../lib/drivers/win32';
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
        await win32.scheduleShutdown(0, false);
        expect(execHelperMock.calls).toEqual([['shutdown.exe', ['/s', '/t', '0'], false]]);
    });

    test('correct command when input is 1', async () => {
        await win32.scheduleShutdown(1, false);
        expect(execHelperMock.calls).toEqual([['shutdown.exe', ['/s', '/t', '60'], false]]);
    });

    test('correct command when input is 67', async () => {
        await win32.scheduleShutdown(67, false);
        expect(execHelperMock.calls).toEqual([['shutdown.exe', ['/s', '/t', '4020'], false]]);
    });

    test('verbose option is passed through', async () => {
        await win32.scheduleShutdown(0, true);
        expect(execHelperMock.calls).toEqual([['shutdown.exe', ['/s', '/t', '0'], true]]);
    });
});

describe('scheduleRestart', () => {
    test('correct command when input is 0', async () => {
        await win32.scheduleRestart(0, false);
        expect(execHelperMock.calls).toEqual([['shutdown.exe', ['/r', '/t', '0'], false]]);
    });

    test('correct command when input is 1', async () => {
        await win32.scheduleRestart(1, false);
        expect(execHelperMock.calls).toEqual([['shutdown.exe', ['/r', '/t', '60'], false]]);
    });

    test('correct command when input is 67', async () => {
        await win32.scheduleRestart(67, false);
        expect(execHelperMock.calls).toEqual([['shutdown.exe', ['/r', '/t', '4020'], false]]);
    });

    test('verbose option is passed through', async () => {
        await win32.scheduleRestart(0, true);
        expect(execHelperMock.calls).toEqual([['shutdown.exe', ['/r', '/t', '0'], true]]);
    });
});

describe('cancelShutdown', () => {
    test('correct command', async () => {
        await win32.cancelShutdown(false);
        expect(execHelperMock.calls).toEqual([['shutdown.exe', ['/a'], false]]);
    });

    test('verbose option is passed through', async () => {
        await win32.cancelShutdown(true);
        expect(execHelperMock.calls).toEqual([['shutdown.exe', ['/a'], true]]);
    });
});

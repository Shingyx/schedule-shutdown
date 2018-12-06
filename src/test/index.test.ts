import { cancelShutdown, scheduleRestart, scheduleShutdown } from '../index';
import * as drivers from '../lib/drivers';

afterEach(() => {
    jest.restoreAllMocks();
});

describe('scheduleShutdown', () => {
    test('values passed to driver when verbose is not defined', async () => {
        const driverArgs: any[][] = [];
        mockDriver({
            async scheduleShutdown(...args: any[]): Promise<void> {
                driverArgs.push(args);
            },
        });

        const time = await scheduleShutdown('1h3m');

        expect(driverArgs).toEqual([[63, false]]);
        assertDateIsClose(time, new Date(Date.now() + 63 * 60 * 1000));
    });

    test('values passed to driver when verbose is set', async () => {
        const driverArgs: any[][] = [];
        mockDriver({
            async scheduleShutdown(...args: any[]): Promise<void> {
                driverArgs.push(args);
            },
        });

        const time = await scheduleShutdown('1h4m', true);

        expect(driverArgs).toEqual([[64, true]]);
        assertDateIsClose(time, new Date(Date.now() + 64 * 60 * 1000));
    });
});

describe('scheduleRestart', () => {
    test('values passed to driver when verbose is not defined', async () => {
        const driverArgs: any[][] = [];
        mockDriver({
            async scheduleRestart(...args: any[]): Promise<void> {
                driverArgs.push(args);
            },
        });

        const time = await scheduleRestart('1h3m');

        expect(driverArgs).toEqual([[63, false]]);
        assertDateIsClose(time, new Date(Date.now() + 63 * 60 * 1000));
    });

    test('values passed to driver when verbose is set', async () => {
        const driverArgs: any[][] = [];
        mockDriver({
            async scheduleRestart(...args: any[]): Promise<void> {
                driverArgs.push(args);
            },
        });

        const time = await scheduleRestart('1h4m', true);

        expect(driverArgs).toEqual([[64, true]]);
        assertDateIsClose(time, new Date(Date.now() + 64 * 60 * 1000));
    });
});

describe('cancelShutdown', () => {
    test('values passed to driver when verbose is not defined', async () => {
        const driverArgs: any[][] = [];
        mockDriver({
            async cancelShutdown(...args: any[]): Promise<void> {
                driverArgs.push(args);
            },
        });

        await cancelShutdown();

        expect(driverArgs).toEqual([[false]]);
    });

    test('values passed to driver when verbose is set', async () => {
        const driverArgs: any[][] = [];
        mockDriver({
            async cancelShutdown(...args: any[]): Promise<void> {
                driverArgs.push(args);
            },
        });

        await cancelShutdown(true);

        expect(driverArgs).toEqual([[true]]);
    });
});

function mockDriver(driver: Partial<drivers.IDriver>): void {
    jest.spyOn(drivers, 'getDriver').mockImplementation((...args: any[]) => {
        expect(args).toEqual([process.platform]);
        return driver;
    });
}

function assertDateIsClose(actual: Date, expected: Date): void {
    const diff = Math.abs(expected.valueOf() - actual.valueOf());
    expect(diff).toBeLessThan(10);
}

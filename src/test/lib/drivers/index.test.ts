import { getDriver } from '../../../lib/drivers';

describe('getDriver', () => {
    test('linux is supported', () => {
        const driver = getDriver('linux');
        expect(driver).toMatchObject({
            scheduleShutdown: expect.anything(),
            scheduleRestart: expect.anything(),
            cancelShutdown: expect.anything(),
        });
    });

    test('win32 is supported', () => {
        const driver = getDriver('win32');
        expect(driver).toMatchObject({
            scheduleShutdown: expect.anything(),
            scheduleRestart: expect.anything(),
            cancelShutdown: expect.anything(),
        });
    });

    test('darwin is not supported', () => {
        expect(() => getDriver('darwin')).toThrow('Your platform "darwin" is not supported');
    });

    test('blah is not supported', () => {
        expect(() => getDriver('blah' as any)).toThrow('Your platform "blah" is not supported');
    });
});

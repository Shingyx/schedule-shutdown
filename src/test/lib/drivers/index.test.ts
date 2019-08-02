import { assert } from 'chai';
import { getDriver } from '../../../lib/drivers';

describe('lib/drivers/index', () => {
    describe('getDriver', () => {
        it('linux is supported', () => {
            const driver = getDriver('linux');
            assert.hasAllKeys(driver, ['scheduleShutdown', 'scheduleRestart', 'cancelShutdown']);
        });

        it('win32 is supported', () => {
            const driver = getDriver('win32');
            assert.hasAllKeys(driver, ['scheduleShutdown', 'scheduleRestart', 'cancelShutdown']);
        });

        it('darwin is supported', () => {
            const driver = getDriver('darwin');
            assert.hasAllKeys(driver, ['scheduleShutdown', 'scheduleRestart', 'cancelShutdown']);
        });

        it('android is not supported', () => {
            assert.throws(() => getDriver('android'), 'Your platform "android" is not supported');
        });

        it('blah is not supported', () => {
            assert.throws(() => getDriver('blah' as any), 'Your platform "blah" is not supported');
        });
    });
});

import { assert } from 'chai';
import sinon from 'sinon';
import win32 from '../../../lib/drivers/win32';
import * as utilities from '../../../lib/utilities';

describe('lib/drivers/win32', () => {
    const sandbox = sinon.createSandbox();
    let execHelperStub: sinon.SinonSpy<[string, any[], boolean], Promise<void>>;

    beforeEach(() => {
        execHelperStub = sandbox.stub(utilities, 'execHelper').resolves();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('scheduleShutdown', () => {
        it('correct command when input is 0', async () => {
            await win32.scheduleShutdown(0, false);
            assert.deepEqual(execHelperStub.args, [['shutdown.exe', ['/s', '/t', '0'], false]]);
        });

        it('correct command when input is 1', async () => {
            await win32.scheduleShutdown(1, false);
            assert.deepEqual(execHelperStub.args, [['shutdown.exe', ['/s', '/t', '60'], false]]);
        });

        it('correct command when input is 67', async () => {
            await win32.scheduleShutdown(67, false);
            assert.deepEqual(execHelperStub.args, [['shutdown.exe', ['/s', '/t', '4020'], false]]);
        });

        it('verbose option is passed through', async () => {
            await win32.scheduleShutdown(0, true);
            assert.deepEqual(execHelperStub.args, [['shutdown.exe', ['/s', '/t', '0'], true]]);
        });
    });

    describe('scheduleRestart', () => {
        it('correct command when input is 0', async () => {
            await win32.scheduleRestart(0, false);
            assert.deepEqual(execHelperStub.args, [['shutdown.exe', ['/r', '/t', '0'], false]]);
        });

        it('correct command when input is 1', async () => {
            await win32.scheduleRestart(1, false);
            assert.deepEqual(execHelperStub.args, [['shutdown.exe', ['/r', '/t', '60'], false]]);
        });

        it('correct command when input is 67', async () => {
            await win32.scheduleRestart(67, false);
            assert.deepEqual(execHelperStub.args, [['shutdown.exe', ['/r', '/t', '4020'], false]]);
        });

        it('verbose option is passed through', async () => {
            await win32.scheduleRestart(0, true);
            assert.deepEqual(execHelperStub.args, [['shutdown.exe', ['/r', '/t', '0'], true]]);
        });
    });

    describe('cancelShutdown', () => {
        it('correct command', async () => {
            await win32.cancelShutdown(false);
            assert.deepEqual(execHelperStub.args, [['shutdown.exe', ['/a'], false]]);
        });

        it('verbose option is passed through', async () => {
            await win32.cancelShutdown(true);
            assert.deepEqual(execHelperStub.args, [['shutdown.exe', ['/a'], true]]);
        });
    });
});

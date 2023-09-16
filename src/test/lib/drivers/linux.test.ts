import { assert } from 'chai';
import sinon from 'sinon';

import linux from '../../../lib/drivers/linux';
import * as utilities from '../../../lib/utilities';

describe('lib/drivers/linux', () => {
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
      await linux.scheduleShutdown(0, false);
      assert.deepEqual(execHelperStub.args, [['shutdown', ['+0'], false]]);
    });

    it('correct command when input is 1', async () => {
      await linux.scheduleShutdown(1, false);
      assert.deepEqual(execHelperStub.args, [['shutdown', ['+1'], false]]);
    });

    it('correct command when input is 67', async () => {
      await linux.scheduleShutdown(67, false);
      assert.deepEqual(execHelperStub.args, [['shutdown', ['+67'], false]]);
    });

    it('verbose option is passed through', async () => {
      await linux.scheduleShutdown(0, true);
      assert.deepEqual(execHelperStub.args, [['shutdown', ['+0'], true]]);
    });
  });

  describe('scheduleRestart', () => {
    it('correct command when input is 0', async () => {
      await linux.scheduleRestart(0, false);
      assert.deepEqual(execHelperStub.args, [['shutdown', ['-r', '+0'], false]]);
    });

    it('correct command when input is 1', async () => {
      await linux.scheduleRestart(1, false);
      assert.deepEqual(execHelperStub.args, [['shutdown', ['-r', '+1'], false]]);
    });

    it('correct command when input is 67', async () => {
      await linux.scheduleRestart(67, false);
      assert.deepEqual(execHelperStub.args, [['shutdown', ['-r', '+67'], false]]);
    });

    it('verbose option is passed through', async () => {
      await linux.scheduleRestart(0, true);
      assert.deepEqual(execHelperStub.args, [['shutdown', ['-r', '+0'], true]]);
    });
  });

  describe('cancelShutdown', () => {
    it('correct command', async () => {
      await linux.cancelShutdown(false);
      assert.deepEqual(execHelperStub.args, [['shutdown', ['-c'], false]]);
    });

    it('verbose option is passed through', async () => {
      await linux.cancelShutdown(true);
      assert.deepEqual(execHelperStub.args, [['shutdown', ['-c'], true]]);
    });
  });
});

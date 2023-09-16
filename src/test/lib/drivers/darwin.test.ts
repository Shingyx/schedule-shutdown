import { assert } from 'chai';
import sinon from 'sinon';

import darwin from '../../../lib/drivers/darwin';
import * as utilities from '../../../lib/utilities';

describe('lib/drivers/darwin', () => {
  const sandbox = sinon.createSandbox();
  let detachedSpawnHelperStub: sinon.SinonSpy<[string, any[], boolean], void>;
  let execHelperStub: sinon.SinonSpy<[string, any[], boolean], Promise<void>>;

  beforeEach(() => {
    detachedSpawnHelperStub = sandbox.stub(utilities, 'detachedSpawnHelper');
    execHelperStub = sandbox.stub(utilities, 'execHelper').resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('scheduleShutdown', () => {
    it('correct command when input is 0', async () => {
      await darwin.scheduleShutdown(0, false);
      assert.deepEqual(detachedSpawnHelperStub.args, [
        ['osascript', ['-e', 'delay 0', '-e', 'tell app "System Events" to shut down'], false],
      ]);
    });

    it('correct command when input is 1', async () => {
      await darwin.scheduleShutdown(1, false);
      assert.deepEqual(detachedSpawnHelperStub.args, [
        ['osascript', ['-e', 'delay 60', '-e', 'tell app "System Events" to shut down'], false],
      ]);
    });

    it('correct command when input is 67', async () => {
      await darwin.scheduleShutdown(67, false);
      assert.deepEqual(detachedSpawnHelperStub.args, [
        ['osascript', ['-e', 'delay 4020', '-e', 'tell app "System Events" to shut down'], false],
      ]);
    });

    it('verbose option is passed through', async () => {
      await darwin.scheduleShutdown(0, true);
      assert.deepEqual(detachedSpawnHelperStub.args, [
        ['osascript', ['-e', 'delay 0', '-e', 'tell app "System Events" to shut down'], true],
      ]);
    });
  });

  describe('scheduleRestart', () => {
    it('correct command when input is 0', async () => {
      await darwin.scheduleRestart(0, false);
      assert.deepEqual(detachedSpawnHelperStub.args, [
        ['osascript', ['-e', 'delay 0', '-e', 'tell app "System Events" to restart'], false],
      ]);
    });

    it('correct command when input is 1', async () => {
      await darwin.scheduleRestart(1, false);
      assert.deepEqual(detachedSpawnHelperStub.args, [
        ['osascript', ['-e', 'delay 60', '-e', 'tell app "System Events" to restart'], false],
      ]);
    });

    it('correct command when input is 67', async () => {
      await darwin.scheduleRestart(67, false);
      assert.deepEqual(detachedSpawnHelperStub.args, [
        ['osascript', ['-e', 'delay 4020', '-e', 'tell app "System Events" to restart'], false],
      ]);
    });

    it('verbose option is passed through', async () => {
      await darwin.scheduleRestart(0, true);
      assert.deepEqual(detachedSpawnHelperStub.args, [
        ['osascript', ['-e', 'delay 0', '-e', 'tell app "System Events" to restart'], true],
      ]);
    });
  });

  describe('cancelShutdown', () => {
    it('correct command', async () => {
      await darwin.cancelShutdown(false);
      assert.deepEqual(execHelperStub.args, [
        [
          'pkill',
          ['-f', 'osascript -e delay [0-9]+ -e tell app "System Events" to (shut down|restart)'],
          false,
        ],
      ]);
    });

    it('verbose option is passed through', async () => {
      await darwin.cancelShutdown(true);
      assert.deepEqual(execHelperStub.args, [
        [
          'pkill',
          ['-f', 'osascript -e delay [0-9]+ -e tell app "System Events" to (shut down|restart)'],
          true,
        ],
      ]);
    });
  });
});

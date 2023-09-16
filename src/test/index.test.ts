import { assert } from 'chai';
import sinon from 'sinon';

import { cancelShutdown, scheduleRestart, scheduleShutdown } from '../index';
import * as drivers from '../lib/drivers';

describe('index', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('scheduleShutdown', () => {
    it('values passed to driver when verbose is not defined', async () => {
      const driverArgs: any[][] = [];
      mockDriver({
        async scheduleShutdown(...args: any[]): Promise<void> {
          driverArgs.push(args);
        },
      });

      const time = await scheduleShutdown('1h3m');

      assert.deepEqual(driverArgs, [[63, false]]);
      assertDateIsClose(time, new Date(Date.now() + 63 * 60 * 1000));
    });

    it('values passed to driver when verbose is set', async () => {
      const driverArgs: any[][] = [];
      mockDriver({
        async scheduleShutdown(...args: any[]): Promise<void> {
          driverArgs.push(args);
        },
      });

      const time = await scheduleShutdown('1h4m', true);

      assert.deepEqual(driverArgs, [[64, true]]);
      assertDateIsClose(time, new Date(Date.now() + 64 * 60 * 1000));
    });
  });

  describe('scheduleRestart', () => {
    it('values passed to driver when verbose is not defined', async () => {
      const driverArgs: any[][] = [];
      mockDriver({
        async scheduleRestart(...args: any[]): Promise<void> {
          driverArgs.push(args);
        },
      });

      const time = await scheduleRestart('1h3m');

      assert.deepEqual(driverArgs, [[63, false]]);
      assertDateIsClose(time, new Date(Date.now() + 63 * 60 * 1000));
    });

    it('values passed to driver when verbose is set', async () => {
      const driverArgs: any[][] = [];
      mockDriver({
        async scheduleRestart(...args: any[]): Promise<void> {
          driverArgs.push(args);
        },
      });

      const time = await scheduleRestart('1h4m', true);

      assert.deepEqual(driverArgs, [[64, true]]);
      assertDateIsClose(time, new Date(Date.now() + 64 * 60 * 1000));
    });
  });

  describe('cancelShutdown', () => {
    it('values passed to driver when verbose is not defined', async () => {
      const driverArgs: any[][] = [];
      mockDriver({
        async cancelShutdown(...args: any[]): Promise<void> {
          driverArgs.push(args);
        },
      });

      await cancelShutdown();

      assert.deepEqual(driverArgs, [[false]]);
    });

    it('values passed to driver when verbose is set', async () => {
      const driverArgs: any[][] = [];
      mockDriver({
        async cancelShutdown(...args: any[]): Promise<void> {
          driverArgs.push(args);
        },
      });

      await cancelShutdown(true);

      assert.deepEqual(driverArgs, [[true]]);
    });
  });

  function mockDriver(driver: Partial<drivers.IDriver>): void {
    sandbox.stub(drivers, 'getDriver').callsFake((...args: any[]) => {
      assert.deepEqual(args, [process.platform]);
      return {
        scheduleShutdown: sandbox.stub().throws(new Error('unexpected call')),
        scheduleRestart: sandbox.stub().throws(new Error('unexpected call')),
        cancelShutdown: sandbox.stub().throws(new Error('unexpected call')),
        ...driver,
      };
    });
  }

  function assertDateIsClose(actual: Date, expected: Date): void {
    const diff = Math.abs(expected.valueOf() - actual.valueOf());
    assert.isAtMost(diff, 50);
  }
});

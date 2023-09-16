#!/usr/bin/env node
import { processArgs } from './lib/cli-helper';

processArgs(process.argv.slice(2)).catch((e) => {
  console.error(`Error: ${e.message.trim()}`);
  process.exit(1);
});

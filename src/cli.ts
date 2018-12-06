#!/usr/bin/env node
import { processArgs } from './lib/cli-helper';

processArgs().catch((e) => {
    console.error(`Error: ${e.message.trim()}`);
    process.exit(1);
});

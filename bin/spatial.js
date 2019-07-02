#!/usr/bin/env node

require('yargs')
  .scriptName('spatial')
  .usage('$0 <cmd> [args]')
  .commandDir('cmd')
  .showHelpOnFail(true)
  .demandCommand(1, '')
  .help()
  .parse()

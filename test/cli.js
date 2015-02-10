#!/usr/bin/env node

var spawn = require('child_process').spawn;

var child = spawn('./node_modules/mocha-phantomjs/bin/mocha-phantomjs', [
  'http://localhost:9000/static/js/test/index.html',
  '--timeout', '25000'
]);

child.on('close', function (code) {
  console.log('Mocha process exited with code ' + code);
  if (code > 0) {
    process.exit(1);
  }
});

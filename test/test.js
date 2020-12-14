const test = require('tape');
const { zipFiles } = require('..');
const JSZip = require('jszip');
const { dirname } = require('path');

test('test', t => {
  t.plan(1);

  zipFiles('**/*.js', {
    cwd: dirname(__dirname),
    dot: false,
    nodir: true,
    nosort: true,
    ignore: 'node_modules/**',
    zip: new JSZip(),
  }).then(zip => {
    const files = zip.file(/\.js$/);
    t.equal(files.length, 2);
  }).catch(err => {
    t.error(err);
  });
});

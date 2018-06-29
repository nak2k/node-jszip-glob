const { readFile, stat } = require('fs');
const { join } = require('path');
const glob = require('glob');
const parallel = require('run-parallel');

/*
 * Zip files that are matched by the pattern.
 */
function zipFiles(pattern, options, callback) {
  glob(pattern, options, (err, files) => {
    if (err) {
      return callback(err);
    }

    const tasks = files.map(f => zipFile.bind(null, f, options));

    parallel(tasks, err => {
      if (err) {
        return callback(err);
      }

      callback(null, options.zip);
    });
  });
}

function zipFile(name, options, callback) {
  const {
    cwd,
    zip,
    compression,
    compressionOptions,
  } = options;

  const file = join(cwd, name);

  stat(file, (err, stats) => {
    if (err) {
      return callback(err);
    }

    readFile(file, (err, data) => {
      if (err) {
        return callback(err);
      }

      zip.file(name, data, {
        mode: stats.mode,
        date: new Date(stats.mtime),
        compression,
        compressionOptions,
      });

      callback(null);
    });
  });
}

/*
 * Exports.
 */
exports.zipFiles = zipFiles;

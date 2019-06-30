const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const { getLogger } = require('../logger');

const DEFAULT_TEMP_DIR = os.tmpdir();

module.exports = ({ basePath = DEFAULT_TEMP_DIR } = { basePath: DEFAULT_TEMP_DIR }) => {
  const logger = getLogger();
  const subdir = 'caravaggioCache';
  const baseDir = path.join(basePath, subdir);
  const getCompleteFilename = filename => path.join(baseDir, filename);

  return {
    flush: () => fs.emptyDir(baseDir),

    exists: filename => fs.access(
      getCompleteFilename(filename),
      fs.constants.R_OK,
    )
      .then(() => true)
      .catch(() => false),

    read: filename => fs.readFile(getCompleteFilename(filename))
      .then(buffer => ({
        type: 'buffer',
        buffer,
      }))
      .catch((err) => {
        if (err.code === 'ENOENT') return null;
        throw err;
      }),

    save: async (filename, buffer) => {
      const completeFilename = getCompleteFilename(filename);
      fs.outputFile(completeFilename, buffer, { encoding: null })
        .catch((e) => {
          logger.error(e, `File persistor failed to save file ${completeFilename}`);
        });
      return {
        type: 'buffer',
        buffer,
      };
    },

  };
};

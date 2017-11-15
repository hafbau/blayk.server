const { getExports } = require('../utils')

module.exports = (models, scheduler) => {
  const toExport = getExports({
    dir: __dirname,
    currentFile: __filename
  }, models, scheduler);

  return toExport;
};

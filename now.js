const merge = require('lodash/merge');
const config = require('./src/config');
const caravaggio = require('./index');

const nowConfig = {
  caches: {
    input: {
      type: 'memory',
      limit: 1024,
    },
    errors: 'html',
    whitelist: ['ramiel.gitlab.io', 'cvg-res.now.sh', 'caravaggio.ramielcreations.com'],
    logger: {
      level: 'debug',
      pretty: false,
    },
  },
};
const configuration = merge(config, nowConfig);

module.exports = caravaggio(configuration);

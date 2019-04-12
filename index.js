const config = require('config');
const Sentry = require('@sentry/node');
const micro = require('micro');
const logger = require('./src/logger');
const app = require('./src');

Sentry.init({ dsn: 'https://f7f2eea225f74aa9b87a30ae1acf593f@sentry.io/1427514' });
logger.debug(config, 'configuration:');
const port = config.get('port');

const server = micro(app);
server.listen(port);

logger.info(`Server started. Listen on port: ${port}.`);


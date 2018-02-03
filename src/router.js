const { router, get } = require('microrouter');
const indexRoute = require('./routes/index');
const Cache = require('./cache');
const errorHandler = require('./middlewares/errorHandler');
const domainWhitelist = require('./middlewares/domainWhitelist');
const { compose } = require('./utils');

module.exports = ({ persistor, whitelist }) => router(get(
  '/*/*',
  compose(
    errorHandler,
    domainWhitelist(whitelist),
  )(indexRoute(Cache(persistor))),
));
const UrlPattern = require('url-pattern');
const { router, get } = require('microrouter');
const indexRoute = require('./routes/index');
const favicon = require('./routes/favicon');
const Cache = require('./caches/output');
const errorHandler = require('./middlewares/errorHandler');
const domainWhitelist = require('./middlewares/domainWhitelist');
const { compose } = require('./utils');

module.exports = config => ({ whitelist }) => router(
  get('/favicon.ico', favicon),
  get(
    // new UrlPattern(/^\/((.+\/)(?!http.+))+((https?:\/\/)*.+)$/),
    // new UrlPattern(/^\/(?:([^/]+\/?)+)$/),
    // new UrlPattern('/*/'),
    // '/*/:url',
    '/*',
    compose(
      errorHandler(config),
      domainWhitelist(whitelist),
    )(indexRoute(config)(Cache(config))),
  ),
  get(
    '/*',
    (req, res) => {
      console.log('here');
    },
  ),
);

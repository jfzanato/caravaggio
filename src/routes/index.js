const { URL } = require('url');
const logger = require('../logger');
const parser = require('../parser');
const pipeline = require('../pipelines');
const sender = require('../sender');

const PARAM_SPLIT = '/';
const isImageUrl = str => str.indexOf('http') === 0;

module.exports = (config) => {
  const { parseOptions } = parser(config);
  const { sendImage } = sender(config);

  return cache => async (req, res) => {
    try {
      const params = req.params._.split(PARAM_SPLIT);
      let urlIndex = params.findIndex(isImageUrl);
      urlIndex = urlIndex !== -1 ? urlIndex : params[params.length - 1];
      const options = parseOptions(params.slice(0, urlIndex));
      const url = new URL(decodeURIComponent(params.slice(urlIndex).join(PARAM_SPLIT)));

      const resource = await cache.get(url, options);
      if (resource) {
        logger.debug(`Cache hit for resource ${url.toString()} with options ${options.rawNormalizedOptions}`);
        await sendImage(resource, options, req, res);
        return;
      }

      // If the resource is missing, let's create it and serve
      const imageBuffer = await pipeline.convert(url, options);
      const createdResource = await cache.set(url, options, imageBuffer);
      await sendImage(createdResource, options, req, res);
    } catch (e) {
      logger.error(e);
      throw e;
    }
  };
};

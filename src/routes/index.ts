import cacheFactory from '../caches/cache';
import { AugmentedRequestHandler } from 'microrouter';
import { Context } from '..';
import operationParser from '../utils/operationParser';
import pipelineCreator from '../pipeline';
import senderCreator from '../utils/sender';
import CError from '../errors/CError';

const indexRoute = (context: Context) => {
  const { logger, config } = context;
  const cache = cacheFactory(config.caches.output);
  const sender = senderCreator(config);
  const pipeline = pipelineCreator(context);

  const handler: AugmentedRequestHandler = async (req, res) => {
    const url = req.url || '/';
    const cachedResource = await cache.get(url);
    if (cachedResource) {
      logger.info(`Cache hit for resource "${url}"`);
      return sender.sendImage(cachedResource, req, res);
    }
    const [path] = url.split('?');
    const rawOperations = operationParser(path);
    const imageUrl = req.query.image;

    if (!imageUrl) {
      throw new CError('You must provide an image url', '', 500);
    }

    logger.debug(imageUrl, 'Image URL');
    logger.debug(rawOperations, 'Raw operations');

    const result = await pipeline({ url: imageUrl, rawOperations, req });
    await sender.sendImage(result, req, res);
    await cache.set(url, result);
  };

  return handler;
};

export default indexRoute;
import { Context } from '..';
import cache from '../caches/cache';

interface ImageLoader {
  /**
   * Given an url, returns the loaded image or raises an error
   * @throws Error if cannot load the image
   */
  get: (url: string) => Promise<Buffer>;
}

const imageLoader = (context: Context): ImageLoader => {
  const { logger } = context;
  const inputCache = cache(context.config.caches.input);
  return {
    get: async (url) => {
      const cached = await inputCache.get(url);
      if (cached) {
        logger.debug(
          `Input cache hit for url "${url}". Do not re-download it.`
        );
        return cached.data;
      }
      const loaded = (await context.pluginManager.inputImageLoader(
        url
      )) as Buffer | null;
      if (loaded === null) {
        throw new Error(`Cannot load image "${url}"`);
      }
      inputCache.set(url, {
        data: loaded,
      });
      return loaded;
    },
  };
};

export default imageLoader;
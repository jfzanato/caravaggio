const { URL } = require('url');
const { createPipeline } = require('../mocks/pipeline');
const q = require('../../src/normalizers/q');

const normalizeQ = ({ value }) => (value * 80) / 100;

describe('Quality', () => {
  test('q is a function', () => {
    expect(q).toBeInstanceOf(Function);
  });

  test('q returns a function as operation', () => {
    expect(q({ value: 45 })).toEqual(expect.objectContaining({
      output: [
        {
          name: 'q',
          operation: expect.any(Function),
          params: [],
        },
      ],
    }));
  });

  test('throws if the value is not in the lower limit', () => {
    expect(() => q({ value: 0 })).toThrow();
  });

  test('throws if the value is not in the upper limit', () => {
    expect(() => q({ value: 101 })).toThrow();
  });

  test('throws if the value is not a number', () => {
    expect(() => q({ value: 'wof' })).toThrow();
  });

  test('round the quality', async () => {
    const qualityGenerator = q({ value: 47 }).output[0].operation;
    const url = new URL('https://image.com/image.jpg');
    const options = {
      o: 'jpeg',
      output: [
        {
          name: 'o',
          operation: 'jpeg',
          params: [],
        },
      ],
    };
    const pipeline = createPipeline(url, options);
    const operations = await qualityGenerator(pipeline);
    expect(operations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'q',
        operation: 'jpeg',
        params: [{ quality: 38 }],
      }),
    ]));
  });

  describe('Given an output has been specified', () => {
    const passedQuality = { value: 90 };
    const qualityGenerator = q(passedQuality).output[0].operation;

    test('add quality if the output is jpeg', async () => {
      const url = new URL('https://image.com/image.jpg');
      const options = {
        o: 'jpeg',
        output: [
          {
            name: 'o',
            operation: 'jpeg',
            params: [],
          },
        ],
      };
      const pipeline = createPipeline(url, options);
      const operations = await qualityGenerator(pipeline);
      expect(operations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'q',
          operation: 'jpeg',
          params: [{ quality: normalizeQ(passedQuality) }],
        }),
      ]));
    });

    test('add quality if the output is jpg', async () => {
      const url = new URL('https://image.com/image.jpg');
      const options = {
        o: 'jpg',
        output: [
          {
            name: 'o',
            operation: 'jpeg',
            params: [],
          },
        ],
      };
      const pipeline = createPipeline(url, options);
      const operations = await qualityGenerator(pipeline);
      expect(operations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'q',
          operation: 'jpeg',
          params: [{ quality: normalizeQ(passedQuality) }],
        }),
      ]));
    });

    test('add quality if the output is webp', async () => {
      const url = new URL('https://image.com/image.jpg');
      const options = {
        o: 'webp',
        output: [
          {
            name: 'o',
            operation: 'webp',
            params: [],
          },
        ],
      };
      const pipeline = createPipeline(url, options);
      const operations = await qualityGenerator(pipeline);
      expect(operations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'q',
          operation: 'webp',
          params: [{ quality: normalizeQ(passedQuality) }],
        }),
      ]));
    });

    test('add quality if the output is tiff', async () => {
      const url = new URL('https://image.com/image.jpg');
      const options = {
        o: 'tiff',
        output: [
          {
            name: 'o',
            operation: 'tiff',
            params: [],
          },
        ],
      };
      const pipeline = await createPipeline(url, options);
      const operations = await qualityGenerator(pipeline);
      expect(operations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'q',
          operation: 'tiff',
          params: [{ quality: normalizeQ(passedQuality) }],
        }),
      ]));
    });

    test('does nothing in case the output is png', async () => {
      const url = new URL('https://image.com/image.jpg');
      const options = {
        o: 'png',
        output: [
          {
            name: 'o',
            operation: 'png',
            params: [],
          },
        ],
      };
      const pipeline = createPipeline(url, options);
      const operations = await qualityGenerator(pipeline);
      expect(operations).toHaveLength(0);
    });
  });

  describe('Given the output as "original"', () => {
    const qualityValue = { value: 90 };
    const qualityGenerator = q(qualityValue).output[0].operation;

    test('add quality if the output is jpeg', async () => {
      const url = new URL('https://image.com/image.jpeg');
      const options = {
        o: 'original',
        output: [],
      };
      const pipeline = createPipeline(url, options);
      const operations = await qualityGenerator(pipeline);
      expect(operations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'q',
          operation: 'jpeg',
          params: [{ quality: normalizeQ(qualityValue) }],
        }),
      ]));
    });

    test('add quality if the output is jpg', async () => {
      const url = new URL('https://image.com/image.jpg');
      const options = {
        o: 'original',
        output: [],
      };
      const pipeline = createPipeline(url, options);
      const operations = await qualityGenerator(pipeline);
      expect(operations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'q',
          operation: 'jpeg',
          params: [{ quality: normalizeQ(qualityValue) }],
        }),
      ]));
    });

    test('add quality if the output is webp', async () => {
      const url = new URL('https://image.com/image.webp');
      const options = {
        o: 'original',
        output: [],
      };
      const pipeline = createPipeline(url, options);
      pipeline.setMetadata({ format: 'webp' });
      const operations = await qualityGenerator(pipeline);
      expect(operations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'q',
          operation: 'webp',
          params: [{ quality: normalizeQ(qualityValue) }],
        }),
      ]));
    });

    test('add quality if the output is tiff', async () => {
      const url = new URL('https://image.com/image.tiff');
      const options = {
        o: 'original',
        output: [],
      };
      const pipeline = createPipeline(url, options);
      pipeline.setMetadata({ format: 'tiff' });
      const operations = await qualityGenerator(pipeline);
      expect(operations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'q',
          operation: 'tiff',
          params: [{ quality: normalizeQ(qualityValue) }],
        }),
      ]));
    });

    test('does nothing in case the output is png', async () => {
      const url = new URL('https://image.com/image.png');
      const options = {
        o: 'original',
        output: [],
      };
      const pipeline = createPipeline(url, options);
      pipeline.setMetadata({ format: 'png' });
      const operations = await qualityGenerator(pipeline);
      expect(operations).toHaveLength(0);
    });

    test('add quality even if the url has no extension', async () => {
      const url = new URL('https://image.com/image');
      const options = {
        o: 'original',
        output: [],
      };
      const pipeline = createPipeline(url, options);
      const operations = await qualityGenerator(pipeline);
      expect(operations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'q',
          operation: 'jpeg',
          params: [{ quality: normalizeQ(qualityValue) }],
        }),
      ]));
    });
  });
});


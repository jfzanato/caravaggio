const config = require('config');
const normalizerFactory = require('../../src/normalizers/');

const normalizer = normalizerFactory(config);

describe('Normalizer', () => {
  test('o is maintained', () => {
    const result = normalizer({
      o: 'original',
      operations: [{ name: 'rotate', value: '90' }],
      rawNormalizedOptions: 'rotate_90',
    });
    expect(result).toHaveProperty('o', 'original');
  });

  test('rawNormalizedOptions is maintained', () => {
    const result = normalizer({
      o: 'original',
      operations: [{ name: 'rotate', value: '90' }],
      rawNormalizedOptions: 'rotate_90',
    });
    expect(result).toHaveProperty('rawNormalizedOptions', 'rotate_90');
  });

  test('a transformation goes in the transformations', () => {
    const result = normalizer({
      o: 'original',
      operations: [{ name: 'blur', value: '9' }],
      rawNormalizedOptions: 'blur_9',
    });
    expect(result).toHaveProperty('transformations');
    expect(result.transformations).toBeInstanceOf(Array);
  });

  test('a the default operations are added if any', () => {
    config.defaultTransformations = [
      { name: 'o', value: 'webp' },
    ];
    const nml = normalizerFactory(config);
    const result = nml({
      o: 'original',
      operations: [{ name: 'blur', value: '9' }],
      rawNormalizedOptions: 'blur_9',
    });
    expect(result.output).toHaveLength(1);
  });

  test('a the default operations is overwritten by one set by the user', () => {
    config.defaultTransformations = [
      { name: 'o', vaule: 'webp' },
    ];
    const nml = normalizerFactory(config);
    const result = nml({
      o: 'png',
      operations: [{ name: 'o', value: 'jpg' }],
      rawNormalizedOptions: 'o_png',
    });
    expect(result.output).toHaveLength(1);
    expect(result.output[0]).toHaveProperty('operation', 'jpeg');
  });
});


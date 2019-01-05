const o = require('../../src/normalizers/o');

describe('Output', () => {
  test('original does not add an operation', () => {
    const result = o({ value: 'original' });
    expect(result).not.toHaveProperty('output');
  });

  test('throws if the format is not supported', () => {
    expect(() => o({ value: 'exotic' })).toThrow();
  });

  test('"jpg" is handled', () => {
    const result = o({ value: 'jpg' });
    expect(result).toEqual(expect.objectContaining({
      o: 'jpg',
      output: [
        {
          name: 'o',
          operation: 'jpeg',
          params: [],
        },
      ],
    }));
  });

  test('"jpeg" is handled', () => {
    const result = o({ value: 'jpeg' });
    expect(result).toEqual(expect.objectContaining({
      o: 'jpeg',
      output: [
        {
          name: 'o',
          operation: 'jpeg',
          params: [],
        },
      ],
    }));
  });

  test('"png" is handled', () => {
    const result = o({ value: 'png' });
    expect(result).toEqual(expect.objectContaining({
      o: 'png',
      output: [
        {
          name: 'o',
          operation: 'png',
          params: [],
        },
      ],
    }));
  });

  test('"webp" is handled', () => {
    const result = o({ value: 'webp' });
    expect(result).toEqual(expect.objectContaining({
      o: 'webp',
      output: [
        {
          name: 'o',
          operation: 'webp',
          params: [],
        },
      ],
    }));
  });

  test('"tiff" is handled', () => {
    const result = o({ value: 'tiff' });
    expect(result).toEqual(expect.objectContaining({
      o: 'tiff',
      output: [
        {
          name: 'o',
          operation: 'tiff',
          params: [],
        },
      ],
    }));
  });
});


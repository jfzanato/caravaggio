const rotate = require('../../src/normalizers/rotate');

describe('Rotate', () => {
  test('Accept multiple of 90°', () => {
    expect(rotate({ value: '180' })).toEqual(expect.objectContaining({
      transformations: [
        {
          name: 'rotate',
          operation: 'rotate',
          params: [180],
        },
      ],
    }));
  });

  test('Accept negative multiple of 90°', () => {
    expect(rotate({ value: '-180' })).toEqual(expect.objectContaining({
      transformations: [
        {
          name: 'rotate',
          operation: 'rotate',
          params: [-180],
        },
      ],
    }));
  });

  test('Accept multiple of 90° beyond 360°', () => {
    expect(rotate({ value: '450' })).toEqual(expect.objectContaining({
      transformations: [
        {
          name: 'rotate',
          operation: 'rotate',
          params: [450],
        },
      ],
    }));
  });

  test('Accept a custom angle', () => {
    expect(rotate({ value: '42' })).toEqual(expect.objectContaining({
      transformations: [
        {
          name: 'rotate',
          operation: 'rotate',
          params: [42],
        },
      ],
    }));
  });

  test('Accept a background color', () => {
    expect(rotate({ value: '42', b: 'ff00ff' })).toEqual(expect.objectContaining({
      transformations: [
        {
          name: 'rotate',
          operation: 'rotate',
          params: [42, {
            background: {
              r: 255, g: 0, b: 255, alpha: 1,
            },
          }],
        },
      ],
    }));
  });

  test('Accept a background color with alpha', () => {
    expect(rotate({ value: '42', b: 'ff00ff.9' })).toEqual(expect.objectContaining({
      transformations: [
        {
          name: 'rotate',
          operation: 'rotate',
          params: [42, {
            background: {
              r: 255, g: 0, b: 255, alpha: 0.9,
            },
          }],
        },
      ],
    }));
  });

  test('throw if the angle is not a number', () => {
    expect(() => rotate('abc')).toThrow();
  });
});


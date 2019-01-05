const flip = require('../../src/normalizers/flip');

describe('Flip', () => {
  test('the default value is horizontal', () => {
    expect(flip({})).toEqual(expect.objectContaining({
      transformations: [
        {
          name: 'flip',
          operation: 'flop',
          params: [true],
        },
      ],
    }));
  });

  test('can flip horizontally', () => {
    expect(flip({ value: 'x' })).toEqual(expect.objectContaining({
      transformations: [
        {
          name: 'flip',
          operation: 'flop',
          params: [true],
        },
      ],
    }));
  });

  test('can flip vertically', () => {
    expect(flip({ value: 'y' })).toEqual(expect.objectContaining({
      transformations: [
        {
          name: 'flip',
          operation: 'flip',
          params: [true],
        },
      ],
    }));
  });

  test('throw if an invalid value is passed', () => {
    expect(() => flip({ value: 'h' })).toThrow();
  });

  test('throw if no value is passed', () => {
    expect(() => flip()).toThrow();
  });
});


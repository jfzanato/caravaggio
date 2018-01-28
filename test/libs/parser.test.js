const { createCallStack, parseOptions } = require('../../src/libs/parser');

describe('Parser', () => {
  describe('option parser', () => {
    test('parser "rotate"', () => {
      const parsedOtpions = parseOptions('rotate_90');
      expect(parsedOtpions).toEqual({
        rotate: 90,
      });
    });
  });

  describe('Call stack creator', () => {
    test('crate a call stack for rotation', () => {
      const options = parseOptions('rotate_90');
      const parsed = createCallStack(options);
      expect(parsed).toEqual([
        ['rotate', 90],
      ]);
    });
  });
});

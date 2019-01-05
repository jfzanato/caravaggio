const config = require('config');

const mockNormalizer = jest.fn(opt => opt);
const { parseOptions } = require('../src/parser')(config);

jest.mock('../src/normalizers', () => () => mockNormalizer);

describe('Parser', () => {
  beforeEach(() => {
    mockNormalizer.mockClear();
  });

  describe('option parser', () => {
    test('parse a single options', () => {
      const rawOption = ['rotate_90'];
      parseOptions(rawOption);
      expect(mockNormalizer).toHaveBeenCalledTimes(1);
      expect(mockNormalizer).toHaveBeenCalledWith({
        o: 'original',
        operations: [{ name: 'rotate', value: '90' }],
        rawNormalizedOptions: rawOption,
      });
    });

    test('parse "o"', () => {
      const rawOption = ['o_jpg'];
      parseOptions(rawOption);
      expect(mockNormalizer).toHaveBeenCalledTimes(1);
      expect(mockNormalizer).toHaveBeenCalledWith({
        o: 'original',
        operations: [{ name: 'o', value: 'jpg' }],
        rawNormalizedOptions: rawOption,
      });
    });

    test('two options, "o" and "rotate"', () => {
      const rawOption = ['o_jpg', 'rotate_90'];
      parseOptions(rawOption);
      expect(mockNormalizer).toHaveBeenCalledTimes(1);
      expect(mockNormalizer).toHaveBeenCalledWith({
        o: 'original',
        operations: [{ name: 'o', value: 'jpg' }, { name: 'rotate', value: '90' }],
        rawNormalizedOptions: rawOption,
      });
    });

    test('parameter among quotes', () => {
      const rawOption = ['overlay_%22http://website%22'];
      parseOptions(rawOption);
      expect(mockNormalizer).toHaveBeenCalledTimes(1);
      expect(mockNormalizer).toHaveBeenCalledWith({
        o: 'original',
        operations: [{ name: 'overlay', value: 'http://website' }],
        rawNormalizedOptions: rawOption,
      });
    });

    test('parameter among quotes with an underscore inside', () => {
      const rawOption = ['overlay,u_%22http://a,b%22'];
      parseOptions(rawOption);
      expect(mockNormalizer).toHaveBeenCalledTimes(1);
      expect(mockNormalizer).toHaveBeenCalledWith({
        o: 'original',
        operations: [{ name: 'overlay', u: 'http://a,b' }],
        rawNormalizedOptions: rawOption,
      });
    });

    test('parameter among quotes with multiple underscores inside (last is underscore)', () => {
      const rawOption = ['overlay_%22http://a_b/c_%22'];
      parseOptions(rawOption);
      expect(mockNormalizer).toHaveBeenCalledTimes(1);
      expect(mockNormalizer).toHaveBeenCalledWith({
        o: 'original',
        operations: [{ name: 'overlay', value: 'http://a_b/c_' }],
        rawNormalizedOptions: rawOption,
      });
    });

    test('parameter among quotes with multiple underscores inside', () => {
      const rawOption = ['overlay_%22http://a_b/c_D_e%22'];
      parseOptions(rawOption);
      expect(mockNormalizer).toHaveBeenCalledTimes(1);
      expect(mockNormalizer).toHaveBeenCalledWith({
        o: 'original',
        operations: [{ name: 'overlay', value: 'http://a_b/c_D_e' }],
        rawNormalizedOptions: rawOption,
      });
    });

    test('same as before multiple times', () => {
      const rawOption = ['overlay,u_%22http://a_b/c_D_e%22,b_%22op_3%22,h_%22g_n%22,q_%22,q_w_e_r_t_y_%22'];
      parseOptions(rawOption);
      expect(mockNormalizer).toHaveBeenCalledTimes(1);
      expect(mockNormalizer).toHaveBeenCalledWith({
        o: 'original',
        operations: [{
          name: 'overlay', u: 'http://a_b/c_D_e', b: 'op_3', h: 'g_n', q: ',q_w_e_r_t_y_',
        }],
        rawNormalizedOptions: rawOption,
      });
    });
  });
});

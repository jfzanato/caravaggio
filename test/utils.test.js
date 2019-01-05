const { rejoinSplittedArray } = require('utils');

describe('utils', () => {
  describe('rejoinSplittedArray', () => {
    describe('single char separator', () => {
      const rejoin = rejoinSplittedArray('"');

      test('leave intact a normally splitted string', () => {
        const string = 'a_b_c';
        expect(rejoin(string.split('_'))).toEqual(['a', 'b', 'c']);
      });

      test('work with simple string', () => {
        const string = 'a_"b_c"';
        expect(rejoin(string.split('_'))).toEqual(['a', 'b_c']);
      });

      test('work with simple string 2', () => {
        const string = 'a_"b_c"_d';
        expect(rejoin(string.split('_'))).toEqual(['a', 'b_c', 'd']);
      });

      test('work with complex string', () => {
        const string = 'a:1_u:"b_c"_d:true';
        expect(rejoin(string.split('_'))).toEqual(['a:1', 'u:b_c', 'd:true']);
      });

      test('work with separator aside block delimiter', () => {
        const string = 'a:1_u:"_c"_d:true';
        expect(rejoin(string.split('_'))).toEqual(['a:1', 'u:_c', 'd:true']);
      });
    });

    describe('multi char separator', () => {
      const rejoin = rejoinSplittedArray('%22');

      test('work with simple string', () => {
        const string = 'a_%22b_c%22';
        expect(rejoin(string.split('_'))).toEqual(['a', 'b_c']);
      });

      test('work with simple string 2', () => {
        const string = 'a_%22b_c%22_d';
        expect(rejoin(string.split('_'))).toEqual(['a', 'b_c', 'd']);
      });

      test('work with complex string', () => {
        const string = 'a:1_u:%22b_c%22_d:true';
        expect(rejoin(string.split('_'))).toEqual(['a:1', 'u:b_c', 'd:true']);
      });

      test('work with separator aside block delimiter', () => {
        const string = 'a:1_u:%22_c%22_d:true';
        expect(rejoin(string.split('_'))).toEqual(['a:1', 'u:_c', 'd:true']);
      });

      test('work with multiple block delimiters', () => {
        const string = 'a:1_u:%22c%22_d:%22true%22';
        expect(rejoin(string.split('_'))).toEqual(['a:1', 'u:c', 'd:true']);
      });
    });
  });
});

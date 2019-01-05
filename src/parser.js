const normalizerFactory = require('./normalizers');
const { rejoinSplittedArray, trim } = require('./utils');


const BOUNDARY_DELIMITER = '%22';
const trimBoundary = trim(BOUNDARY_DELIMITER);

/**
 * If the option is in the format a_b_"c_d" it must be splitted in "a", "b, "c_d"
 * This function takes care of joining all the parameter splitted by a dumb split
 * @param {Array} options
 */
const joinOptionsSplittedAmongSeparator = rejoinSplittedArray(BOUNDARY_DELIMITER);


module.exports = (config) => {
  const normalizer = normalizerFactory(config);
  return {

    parseOptions: (opts) => {
      const operations = opts.map((option) => {
        let [opName, ...opParams] = option.split(',');
        opParams = joinOptionsSplittedAmongSeparator(opParams, ',');

        if (opParams.length === 0) {
          const [name, ...value] = opName.split('_');
          return {
            name,
            value: trimBoundary(value.join('_')),
          };
        }
        return {
          name: opName,
          ...opParams.reduce((acc, param) => {
            let [key, ...value] = param.split('_');
            if (value.length === 0) {
              value = key;
              key = 'value';
            }
            return {
              ...acc,
              [key]: trimBoundary(value.join('_')),
            };
          }, {}),
        };
      });

      const options = {
        o: 'original',
        operations,
        rawNormalizedOptions: opts,
      };
      try {
        return normalizer(options);
      } catch (e) {
        throw e;
      }
    },
  };
};


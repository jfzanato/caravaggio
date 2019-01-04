const normalizerFactory = require('./normalizers');
const { rejoinSplittedArray } = require('./utils');


/**
 * If the option is in the format a_b_"c_d" it must be splitted in "a", "b, "c_d"
 * This function takes care of joining all the parameter splitted by a dumb split
 * @param {Array} options
 */
const joinOptionsSplittedAmongSeparator = rejoinSplittedArray('%22');


module.exports = (config) => {
  const normalizer = normalizerFactory(config);
  return {

    parseOptions: (opts) => {
      const operations = opts.map((option) => {
        let [opName, ...opParams] = option.split(',');
        opParams = joinOptionsSplittedAmongSeparator(opParams, ',');
        if (opParams.length === 0) {
          const [name, value] = opName.split('_');
          return {
            name,
            value,
          };
        }
        return {
          name: opName,
          ...opParams.reduce((acc, param) => {
            const [key, value] = param.split('_');
            return {
              ...acc,
              [key]: value,
            };
          }, {}),
        };
      });
      console.log(operations);
      const optsAsArray = opts.split(',');
      const options = {
        o: 'original',
        operations: optsAsArray.map(
          o => joinOptionsSplittedAmongSeparator(o.split('_')),
        ),
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


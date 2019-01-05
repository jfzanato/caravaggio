const jsonReplacer = (key, value) => {
  if (Buffer.isBuffer(value)) {
    return `<Buffer of ${value.length} bytes>`;
  }
  if (Array.isArray(value)) {
    return value.map(v => jsonReplacer(null, v));
  }
  return value;
};

module.exports = {
  compose: (...fns) => fns.reduce((f, g) => (...args) => f(g(...args))),

  getPipelineOperationSortFunction: order => (a, b) => {
    const aIndex = order.indexOf(a.name);
    const bIndex = order.indexOf(b.name);
    return aIndex - bIndex;
  },

  buildDocumentationLink: doc => `https://ramiel.gitlab.io/caravaggio/docs/${doc || 'docs.html'}`,

  isPercentage: percentage => `${percentage}`.indexOf('.') !== -1,
  percentageToPixel: (percentage, size) => Math.round(percentage * size),

  stringifyParams: params => JSON.stringify(params, jsonReplacer, ''),

  /**
   * Trim an arbitrary set of charachters from a string
   */
  trim: (ch) => {
    const regexp = new RegExp(`^${ch}+|${ch}+$`, 'g');
    return str => str.replace(regexp, '');
  },

  /**
   * Given a string splitted with a separator, rejoins parts that where among a delimiter
   * a_"b_c"_d
   * initially splitted in [a,"b,c",d]
   * is rejoined as [a, b_c, d]
   * setting " as block delimiter and _ as separator
   */
  rejoinSplittedArray: (BLOCK_DELIMITER = '%22') => {
    const BLOCKDELIMITERLENGTH = BLOCK_DELIMITER.length;
    const BLOCK_DELIMITER_REMOVER_REGEXP = new RegExp(`${BLOCK_DELIMITER}`, 'mg');

    return (options, SEP = '_') => options.reduce((acc, opt) => {
      if (Array.isArray(acc[acc.length - 1])) {
        let lastOpt = [
          ...acc.slice(acc.length - 1)[0],
          opt,
        ];
        if (opt.lastIndexOf(BLOCK_DELIMITER) === opt.length - BLOCKDELIMITERLENGTH) {
          lastOpt = lastOpt.join(SEP).replace(BLOCK_DELIMITER_REMOVER_REGEXP, '');
        }
        return [
          ...acc.slice(0, acc.length - 1),
          lastOpt,
        ];
      }
      const firstIndex = opt.indexOf(BLOCK_DELIMITER);
      if (firstIndex >= 0) {
        const ret = firstIndex !== opt.lastIndexOf(BLOCK_DELIMITER)
          ? opt.replace(BLOCK_DELIMITER_REMOVER_REGEXP, '')
          : [opt.replace(BLOCK_DELIMITER_REMOVER_REGEXP, '')];
        return [
          ...acc,
          ret,
        ];
      }


      return [
        ...acc,
        opt,
      ];
    }, []);
  },
};


module.exports = opts => {
  const defaultOptions = {};
  const parsedOptions = {};
  opts.split(',').forEach(option => {
    const [key, param] = option.split('_');
    parsedOptions[key] = param;
  });
  const options = {
    ...defaultOptions,
    ...parsedOptions,
  }

  const callStack = Object.entries(options).map(([option, param]) => {
    switch (option.toLowerCase()) {
      case 'rotate':
        return ['rotate', param || null]
        break;
    
      default:
        break;
    }
  })

  return callStack;
}
module.exports = (/* pipeline */) => async ({ width, height, iar = false }) => {
  const params = [width, height];
  if (iar) {
    params.push({ fit: 'fill' });
  }
  const operations = [
    {
      name: 'resize',
      operation: 'resize',
      params,
    },
  ];
  return operations;
};


const cohercer = require('../cohercer');
const { getColorFromParameter } = require('./resize/color');

module.exports = ({ value, v, b: rawColor }) => {
  const angle = cohercer(v || value, 'Angle must be a number', 'rotate.html')
    .toInt()
    .value();

  const params = [angle];
  let background;
  if (rawColor) {
    background = (rawColor && getColorFromParameter(rawColor));
    params.push({ background });
  }


  return {
    transformations: [
      {
        name: 'rotate',
        operation: 'rotate',
        params,
      },
    ],
  };
};


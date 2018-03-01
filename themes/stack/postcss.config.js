// PostCSS - Configurazione
'use strict';

// Esportazione Modulo
module.exports = {
  parser: 'sugarss',
  syntax: 'postcss-scss',
  stringifier: 'midas',
  map: 'inline',
  plugins: [
    require('autoprefixer')({
      grid: true,
    }),
  ],
};

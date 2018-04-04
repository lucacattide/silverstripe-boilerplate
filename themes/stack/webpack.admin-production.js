// Webpack - Configurazione admin (Produzione)
'use strict';

// Dichiarazione Costanti
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: 'css/dist/admin.css',
});
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Esportazione modulo
module.exports = {
  // Sorgenti
  entry: [
    './js/index.js',
    './js/admin.js',
  ],
  output: {
    filename: 'admin.js',
    path: path.resolve(__dirname, './'),
  },
  plugins: [
    // SASS - CSS
    extractSass,
    // Pulizia
    new CleanWebpackPlugin([
      './css/dist/admin.css',
      './admin.js',
    ]),
  ],
};

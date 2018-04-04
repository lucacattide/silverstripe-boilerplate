// Webpack - Configurazione privacy (Sviluppo)
'use strict';

// Dichiarazione Costanti
const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const developmentConfig = require('./webpack.development.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: 'css/dist/privacy.css',
});
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Esportazione modulo
module.exports = merge(commonConfig, developmentConfig, {
  // Sorgenti
  entry: [
    './js/index.js',
    './js/privacy.js',
  ],
  output: {
    filename: 'privacy.js',
    path: path.resolve(__dirname, './'),
  },
  plugins: [
    // SASS - CSS
    extractSass,
    // Pulizia
    new CleanWebpackPlugin([
      './css/dist/privacy.css',
      './privacy.js',
    ]),
  ],
});

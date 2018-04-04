// Webpack - Configurazione admin (Sviluppo)
'use strict';

// Dichiarazione Costanti
const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const developmentConfig = require('./webpack.development.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: 'css/dist/admin.css',
});
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Esportazione modulo
module.exports = merge(commonConfig, developmentConfig, {
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
});

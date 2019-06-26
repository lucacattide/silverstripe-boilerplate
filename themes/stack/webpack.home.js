// Webpack - Home Configuration (Development)
'use strict';

// Module Imports
const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const developmentConfig = require('./webpack.development.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: '../css/home.css',
});
const {
  CleanWebpackPlugin,
} = require('clean-webpack-plugin');
const {
  InjectManifest,
} = require('workbox-webpack-plugin');

// Module Exports
module.exports = merge(commonConfig, developmentConfig, {
  // Sources
  entry: [
    './js/frontend/index.js',
    './js/frontend/home/home.js',
  ],
  output: {
    filename: 'home.js',
    path: path.resolve(__dirname, './js/frontend/'),
  },
  plugins: [
    // SASS - CSS
    extractSass,
    // Pulizia
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        './css/home.css',
        './js/frontend/home.js',
      ],
    }),
    // PWA
    new InjectManifest({
      swSrc: path.join('./js/frontend', 'service-worker.js'),
      swDest: path.join('./', 'service-worker-dev.js'),
      importsDirectory: './frontend/lib/workbox',
      globPatterns: [
        'css/**/*',
        'img',
        'js/frontend/home.js',
        'js/frontend/refresh.js',
        'js/frontend/install.js',
        'php',
      ],
    }),
  ],
});

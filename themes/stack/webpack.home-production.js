// Webpack - Home Configuration (Production)
'use strict';

// Module Imports
const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: '../css/dist/home.css',
});
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const {
  InjectManifest,
} = require('workbox-webpack-plugin');

// Module Export
module.exports = merge(commonConfig, {
  mode: 'production',
  // Sources
  entry: [
    './js/frontend/index.js',
    './js/frontend/home.js',
  ],
  output: {
    filename: 'home.js',
    path: path.resolve(__dirname, './js/frontend/dist'),
  },
  module: {
    rules: [{
      // HTML
      test: /\/html\/dist\/\.html$/,
      loaders: [
        'file-loader?name=[name].html',
        'extract-loader',
        'html-loader',
      ],
    }],
  },
  plugins: [
    // Environment setting
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    // SASS - CSS
    extractSass,
    // Images
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production',
      test: ('img'),
      optipng: {
        optimizationLevel: 9,
      },
      gifsicle: {
        optimizationLevel: 9,
      },
    }),
    // Optimization - HTML
    new HtmlMinifierPlugin({
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      keepClosingSlash: true,
      maxLineLength: 80,
      preventAttributesEscaping: true,
      removeComments: true,
      removeScriptTypeAttributes: true,
      trimCustomFragments: true,
    }),
    // Optimization - CSS
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
        }],
      },
    }),
    new CopyWebpackPlugin([{
      from: 'html/**/*',
      to: './html/dist',
    },
    {
      from: 'php/**/*',
      to: './php/dist',
    },
    {
      from: 'index.php',
      to: 'dist',
    },
    ], {
      copyUnmodified: true,
    }),
    // Banner
    new webpack.BannerPlugin({
      banner: ' versione 1.0.0 - © Luca Cattide 2019. All Rights reserved. https://lucacattide.it - Luca Cattide - Senior Frontend Developer <info@lucacattide.it> | (https://lucacattide.it). Released under license apache-2.0',
      raw: false,
      entryOnly: true,
    }),
    // Cleanings
    new CleanWebpackPlugin([
      './css/dist/home.css',
      './js/frontend/dist/home.js',
    ]),
    // PWA
    new InjectManifest({
      swSrc: path.join('./js/frontend/', 'service-worker.js'),
      swDest: path.join('./frontend/dist', 'service-worker-prod.js'),
      importsDirectory: './frontend/lib/workbox',
      globPatterns: [
        'css/**/*',
        'img',
        'js/frontend/dist/home.js',
        'js/frontend/refresh.js',
        'js/frontend/install.js',
        'php',
      ],
    }),
  ],
});

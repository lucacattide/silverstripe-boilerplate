// Webpack - Configurazione (Produzione)
'use strict';

// Dichiarazione Costanti
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const indexConfig = require('./webpack.index-production.js');
const webpack = require('webpack');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');

// Esportazione modulo
module.exports = merge(commonConfig, indexConfig, {
  module: {
    loaders: [{
        // HTML
        test: /\/html\/dist\/\.html$/,
        loaders: [
          'file-loader?name=[name].html',
          'extract-loader',
          'html-loader',
        ],
      },
    ],
  },
  plugins: [
    // Definizione Ambiente
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    // Immagini
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
    // Versioni Prodzione
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
    // Minificazione - Produzione
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
    // Banner
    new webpack.BannerPlugin({
      banner: ' versione 1.0.0 - © Greylab 2018. Tutti i Diritti riservati. http://lucacattide.it - Luca Cattide - Front-End Web Developer <luca.cattide@greylab.it> | (http://lucacattide.it). Rilasciato sotto licenza apache-2.0',
      raw: false,
      entryOnly: true,
    }),
  ],
});

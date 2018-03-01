// Webpack - Configurazione (Sviluppo)
'use strict';

// Dichiarazione Costanti
const path = require('path');
const webpack = require('webpack');
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer')
.WebpackBundleSizeAnalyzerPlugin;
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// Esportazione modulo
module.exports = {
  module: {
    rules: [{
        // Immagini
        test: /\.(png|svg|jpg|gif)$/,
        include: path.resolve(__dirname, './img'),
        use: [{
          loader: 'file-loader',
          options: {
            useRelativePath: true,
          },
        }],
      },
    ],
  },
  plugins: [
    // Definizione Ambiente
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
      },
    }),
    // Log
    new WebpackBundleSizeAnalyzerPlugin('./log/sizes.txt'),
    // Proxy
    new BrowserSyncPlugin({
      browser: 'google chrome',
      host: 'dev.test.it',
      proxy: 'dev.test.it',
      files: [{
        match: [
          '**/*.css',
          '**/*.js',
          '**/*.html',
          '**/*.php',
        ],
        fn: function(event, file) {
          if (event === 'change') {
            const bs = require('browser-sync').get('bs-webpack-plugin');
            bs.reload();
          }
        },
      }],
    }),
  ],
  externals: {
    // jQuery
    jquery: 'jQuery',
  },
};

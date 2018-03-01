// Webpack - Configurazione Globale
'use strict';

// Dichiarazione Costanti
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

// Esportazione modulo
module.exports = {
  devtool: process.env.NODE_ENV !== 'production' ? 'cheap-module-eval-source-map' : false,
  module: {
    rules: [{
        // SASS - CSS
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, './css'),
          path.resolve(__dirname, './sass'),
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
                minimize: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                ident: 'postcss',
                plugins: () => [
                  autoprefixer,
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [
                  path.resolve(__dirname, 'node_modules/compass-mixins/lib'),
                  path.resolve(__dirname, 'sass'),
                ],
              },
            },
          ],
        }),
      },
      {
        // Fonts
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        include: path.resolve(__dirname, './fonts'),
        use: [{
          loader: 'file-loader',
          options: {
            publicPath: '/fonts/',
            outputPath: '/fonts/',
            useRelativePath: true,
          },
        }],
      },
      {
        // JS
        test: /\.js$/,
        include: path.resolve(__dirname, './'),
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      // Modernizr
      {
        test: /\.modernizrrc.js$/,
        use: ['webpack-modernizr-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      modernizr$: path.resolve(__dirname, './.modernizrrc.js'),
    },
  },
  plugins: [
    // Manifest
    new ManifestPlugin(),
    // Pulizia
    new CleanWebpackPlugin([
      './html/dist',
      './php/dist',
      './dist',
    ]),
  ],
};

var path = require('path')
var utils = require('./utils')
var config = require('../config')
require("babel-polyfill");


function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/app.js']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  externals: {
    'html_beautify':'html_beautify',
  },
  resolve: {
    extensions: ['ts', 'tsx', '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.js', '.less', '.css'],
    modules: [
      resolve('src'),
      resolve('node_modules'),
   ],
    alias: {
      'node_modules': path.resolve(__dirname, '../node_modules'),
      'src': path.resolve(__dirname, '../src'),
      'css': path.resolve(__dirname, '../src/css'),
      'static': path.resolve(__dirname, '../src/static'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [resolve('src')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(svg)$/i,
        loader: 'svg-sprite-loader',
        include: [
          // antd-mobile svg
          // require.resolve('antd-mobile').replace(/warn\.js$/, ''),
          path.resolve(__dirname, 'static/svg'),
        ]
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|woff|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: utils.assetsPath('font/[name].[hash:7].[ext]')
        },
        exclude: [
          require.resolve('antd').replace(/warn\.js$/, ''),
        ]
      }
    ],
    noParse: [new RegExp('node_modules/localforage/dist/localforage.js')]
  }
}

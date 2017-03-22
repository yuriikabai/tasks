const webpack = require('webpack');
const { resolve } = require('path');
const Config = require('webpack-config').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const config = new Config();

/**
 * Common
 */
config.merge({
  entry: resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'main.[hash].js',
    path: resolve(__dirname, 'dist')
  },
  context: resolve(__dirname),
  devtool: 'source-map',
  bail: isProd,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                'transform-runtime',
                'transform-class-properties'
              ],
              presets: [
                ['es2015', { modules: false }],
                'stage-2'
              ]
            }
          },
          {
            loader: 'eslint-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: true,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]'
              }
            }
          ]
        })
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'src/index.html'),
      inject: 'body'
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV
    }),
    new ExtractTextPlugin('styles.css')
  ]
});


/**
 * Development
 */
if (isDev) {
  config.merge({
    output: {
      pathinfo: true
    },
    devServer: {
      contentBase: './public',
      hot: true,
      inline: true,
      historyApiFallback: true,
      noInfo: true,
      quiet: true
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        debug: true
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

module.exports = config;

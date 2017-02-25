const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const uiConfig = require('./ui.config');
const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production';
const devtool = isProd ? 'cheap-module-source-map' : 'cheap-module-eval-source-map';
const plugins = isProd ? [
  new ExtractTextPlugin('styles.css'),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
] : [
  new ExtractTextPlugin('styles.css'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
];
const entry = require('./entry');

if (!isProd) {
  Object.keys(entry).forEach((key) => {
    const hotClient = ['webpack-hot-middleware/client?reload=true'];
    const isCsr = key.slice(-4) !== '_ssr';
    if (isCsr) {
      entry[key] = hotClient.concat(entry[key]);
    }
  });
}

module.exports = {
  devtool,
  entry,
  output: {
    filename: '[name].bundle.js',
    path: uiConfig.build,
    publicPath: '/build/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        loaders: ['eslint-loader'],
        exclude: /(node_modules)/,
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: /(node_modules)/,
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader' }),
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
        loader: 'url-loader',
      },
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, '/../node_modules'),
      __dirname,
    ],
    extensions: ['.js', '.jsx'],
  },
  plugins,
};

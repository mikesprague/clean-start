const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const mode = process.env.NODE_ENV || 'production';
const buildType = process.env.BUILD_TYPE;

const webpackRules = [
  {
    test: /\.(ttf|eot|woff|woff2)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[hash][ext]',
        outputPath: 'fonts/',
      },
    },
  },
  {
    test: /\.(sa|sc|c)ss$/,
    exclude: [/old/],
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: true,
          sourceMap: true,
        },
      },
      {
        loader: 'postcss-loader',
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  },
  {
    test: /\.(js|jsx)$/,
    exclude: [/node_modules/, /lambda/, /sw.js/, /service-worker.js/],
    use: [{
      loader: 'babel-loader',
    }],
  },
];

const webpackPlugins = [
  new MiniCssExtractPlugin({
    filename: './css/styles.css',
    chunkFilename: './css/[id].[chunkhash].css',
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: './public/images/**/*',
        to: './images/[name][ext]',
        force: true,
      },
    ],
  }),
  // new CopyWebpackPlugin({
  //   patterns: [
  //     {
  //       from: './public/fonts/*.woff2',
  //       to: './fonts/[name][ext]',
  //       force: true,
  //     },
  //   ],
  // }),
  new CopyWebpackPlugin({
    patterns: [
      {
	from: `./public/${buildType === 'extension' ? 'manifest.json' : 'cleanstart.webmanifest'}`,
        to: './[name][ext]',
        force: true,
      },
    ],
  }),
  new HtmlWebpackPlugin({
    template: `./public/${buildType === 'extension' ? 'extension' : 'pwa'}.html`,
    filename: './index.html',
    inject: false,
  }),
  new WorkboxPlugin.GenerateSW({
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    exclude: [/chrome-extension:\/\//],
    skipWaiting: true,
  }),
  new CompressionPlugin({
    include: [/.js$/, /.css$/, /.html$/],
  }),
];

module.exports = {
  entry: [
    './src/index.js',
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    filename: './js/[name].js',
    chunkFilename: './js/[id].[chunkhash].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  mode,
  module: {
    rules: webpackRules,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: webpackPlugins,
};

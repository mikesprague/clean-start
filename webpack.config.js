const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const path = require('path');
const purgecss = require('@fullhuman/postcss-purgecss');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const mode = process.env.NODE_ENV;
const buildType = process.env.BUILD_TYPE;

console.log(buildType);

const webpackRules = [
  {
    test: /\.(ttf|eot|woff|woff2)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[ext]',
      },
    },
  },
  {
    test: /\.(sa|sc|c)ss$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins() {
            return [
              autoprefixer(),
              cssnano({
                preset: 'default',
              }),
              purgecss({
                content: ['./src/*.html', './src/js/modules/*.js'],
                fontFace: true,
                whitelistPatterns: [/tippy/],
                whitelistPatternsChildren: [/tippy/],
              }),
            ];
          },
        },
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
    test: /\.(js)$/,
    exclude: [/node_modules/, /lambda/],
    use: [{
      loader: 'babel-loader',
    }],
  },
];

const webpackPlugins = [
  new MiniCssExtractPlugin({
    filename: './css/styles.css',
    chunkFilename: './css/[id].css',
  }),

  new CopyWebpackPlugin({
    patterns: [
      {
        from: `./src/manifest${buildType === 'extension' ? '' : '-pwa'}.json`,
        to: './',
        flatten: true,
        force: true,
      },
    ],
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: './src/images/**/*',
        to: './images',
        flatten: true,
        force: true,
      },
    ],
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: `./src/${buildType === 'extension' ? 'extension' : 'pwa'}.html`,
        to: './index.html',
        force: true,
        flatten: true,
      },
    ],
  }),
  // new HtmlWebpackPlugin({
  //   inject: false,
  //   template: './src/index.html',
  //   environment: mode,
  //   appName: variables.appName,
  //   author: variables.author,
  //   canonical,
  //   description: variables.description,
  //   keywords: variables.keywords,
  //   loadingText: variables.loadingText,
  //   themeColor: variables.themeColor,
  //   title: variables.title,
  //   versionString: variables.versionString,
  // }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: './src/fonts/*.woff2',
        to: './fonts',
        flatten: true,
        force: true,
      },
    ],
  }),
  new WorkboxPlugin.GenerateSW({
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
  }),
];

if (mode === 'production') {
  webpackPlugins.push(
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  );
}

module.exports = {
  entry: [
    './src/js/app.js',
  ],
  devtool: 'source-map',
  output: {
    filename: './js/bundle.js',
    chunkFilename: './js/[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  mode,
  module: {
    rules: webpackRules,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
  },
  plugins: webpackPlugins,
};

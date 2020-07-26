const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const path = require('path');
const purgecss = require('@fullhuman/postcss-purgecss');
const tailwindcss = require('tailwindcss');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const mode = process.env.NODE_ENV;
const buildType = process.env.BUILD_TYPE;

const cssWhitelistClassArray = [/tippy/];

const webpackRules = [
  {
    test: /\.(ttf|eot|woff|woff2)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: './fonts/[name].[ext]',
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
                content: [
                  './src/*.html',
                  './src/js/modules/*.js'
                  // './public/index.html',
                  // './src/**/*.js',
                  // './src/**/*.jsx',
                ],
                defaultExtractor: (content) => {
                  // Capture as liberally as possible, including things like `h-(screen-1.5)`
                  const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
                  // Capture classes within other delimiters like .block(class="w-1/2") in Pug
                  const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
                  return broadMatches.concat(innerMatches);
                },
                fontFace: true,
                whitelistPatterns: cssWhitelistClassArray,
                whitelistPatternsChildren: cssWhitelistClassArray,
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
    test: /\.(js|jsx)$/,
    exclude: [/node_modules/, /lambda/, /service-worker.js/],
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
        from: './public/images/**/*',
        to: './images',
        flatten: true,
        force: true,
      },
    ],
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: './public/fonts/*.woff2',
        to: './fonts',
        flatten: true,
        force: true,
      },
    ],
  }),
  // new CopyWebpackPlugin({
  //   patterns: [
  //     {
  //       from: './public/*.*',
  //       to: './',
  //       flatten: true,
  //       force: true,
  //     },
  //   ],
  // }),
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
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    filename: './js/bundle.js',
    chunkFilename: './js/[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  mode,
  devServer: {
    contentBase: path.join(__dirname, 'public/'),
    hotOnly: true,
    port: 4444,
    publicPath: 'http://localhost:4444/',
    stats: 'minimal',
  },
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

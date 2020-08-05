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
const WebPackBar = require('webpackbar');
const WorkboxPlugin = require('workbox-webpack-plugin');

const mode = process.env.NODE_ENV;
const buildType = process.env.BUILD_TYPE;

const cssWhitelistClassArray = [/tippy/, /odd/, /repo-language-color/, /fa-rotate-270/];

const postCssPluginsArray = [
    autoprefixer(),
    tailwindcss(),
    cssnano({
      preset: 'default',
    }),
];
if (mode === 'production') {
  postCssPluginsArray.push(
    purgecss({
      content: [
        './public/index.html',
        './src/components//**/*.js',
        './src/components//**/*.jsx',
      ],
      defaultExtractor: (content) => {
        // Capture as liberally as possible, including things like `h-(screen-1.5)`
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
        // Capture classes within other delimiters like .block(class="w-1/2") in Pug
        const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
        return broadMatches.concat(innerMatches);
      },
      fontFace: false,
      whitelistPatterns: cssWhitelistClassArray,
      whitelistPatternsChildren: cssWhitelistClassArray,
    })
  );
}

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
    exclude: [/old/],
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
            return postCssPluginsArray;
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
    exclude: [/node_modules/, /lambda/, /sw.js/, /service-worker.js/],
    use: [{
      loader: 'babel-loader',
    }],
  },
];

const webpackPlugins = [
  new WebPackBar(),
  new MiniCssExtractPlugin({
    filename: './css/styles.css',
    chunkFilename: './css/[id].css',
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
        to: './css/fonts',
        flatten: true,
        force: true,
      },
    ],
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: `./public/manifest${buildType === 'extension' ? '' : '-pwa'}.json`,
        to: './',
        flatten: true,
        force: true,
      },
    ],
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: `./public/${buildType === 'extension' ? 'extension' : 'pwa'}.html`,
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
  new webpack.HotModuleReplacementPlugin()
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
    './src/index.js',
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
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
    open: true,
    port: 3000,
    publicPath: 'http://localhost:3000/',
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

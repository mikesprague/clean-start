const cssWhitelistClassArray = [
  /tippy/,
  /odd/,
  /repo-language-color/,
  /fa-rotate-270/,
  /w-1\/2/,
  /w-1\/4/,
  /w-full/,
];

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('tailwindcss'),
    require('cssnano')({
      preset: 'default',
    }),
    require('@fullhuman/postcss-purgecss')({
      content: [
        './src/index.html',
        './src/index.jsx',
        './src/components/*.jsx',
        './src/modules/*.jsx',
        './src/modules/*.js',
      ],
      fontFace: false,
      safelist: cssWhitelistClassArray,
    }),
  ],
};

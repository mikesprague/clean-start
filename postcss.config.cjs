const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const cssnano = require('cssnano');
const purgecss = require('@fullhuman/postcss-purgecss');

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
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
    autoprefixer: {},
    tailwindcss: {},
    cssnano: {
      preset: 'default',
    },
    'postcss-purgecss': {
      content: [
        './src/index.html',
        './src/index.jsx',
        './src/components/*.jsx',
        './src/modules/*.jsx',
        './src/modules/*.js',
      ],
      fontFace: false,
      safelist: cssWhitelistClassArray,
    },
  },
};

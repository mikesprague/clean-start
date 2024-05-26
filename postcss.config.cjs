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
    '@fullhuman/postcss-purgecss': {
      content: [
        './src/*.{html,tsx}',
        './src/components/*.{js,ts,jsx,tsx}',
        './src/modules/*.{js,ts,jsx,tsx}',
      ],
      blocklist: ['node_modules'],
      fontFace: false,
      safelist: cssWhitelistClassArray,
    },
  },
};

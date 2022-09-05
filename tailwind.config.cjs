module.exports = {
  content: [
    './src/**/*.html',
    './src/index.jsx',
    './src/components/**/*.jsx',
    './src/modules/**/*.js',
    './src/modules/**/*.jx',
  ],
  mode: 'jit',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};

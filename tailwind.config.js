module.exports = {
  content: ['./public/**/*.html', './src/components/**/*.js', './src/modules/**/*.js'],
  mode: 'jit',
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/typography')],
};

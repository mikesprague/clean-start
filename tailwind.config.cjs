module.exports = {
  content: [
    './src/*.{html,tsx}',
    './src/components/*.{js,ts,jsx,tsx}',
    './src/modules/*.{js,ts,jsx,tsx}',
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

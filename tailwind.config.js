module.exports = {
  purge: false,
  theme: {
    extend: {},
  },
  variants: {},
  future: {
    removeDeprecatedGapUtilities: true,
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

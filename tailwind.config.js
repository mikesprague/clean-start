module.exports = {
  purge: false,
  experimental: {
    applyComplexClasses: true,
    uniformColorPalette: true,
    extendedSpacingScale: true,
    extendedFontSizeScale: true,
    defaultLineHeights: false,
  },
  theme: {
    extend: {},
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

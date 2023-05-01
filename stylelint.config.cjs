module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-standard'],
  rules: {
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    'no-empty-source': null,
    'at-rule-no-unknown': null,
  },
};

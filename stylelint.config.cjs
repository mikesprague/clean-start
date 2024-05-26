module.exports = {
  extends: ["stylelint-config-standard-scss", "stylelint-config-standard"],
  rules: {
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
        ],
      },
    ],
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null,
    "no-empty-source": null,
    "at-rule-no-unknown": null,
  },
  "custom-property-pattern": null,
  "selector-class-pattern": null,
  "scss/no-duplicate-mixins": null,
  "declaration-empty-line-before": null,
  "declaration-block-no-redundant-longhand-properties": null,
  "alpha-value-notation": null,
  "custom-property-empty-line-before": null,
  "property-no-vendor-prefix": null,
  "color-function-notation": null,
  "length-zero-no-unit": null,
  "selector-not-notation": null,
  "no-descending-specificity": null,
  "comment-empty-line-before": null,
  "scss/at-mixin-pattern": null,
  "scss/at-rule-no-unknown": null,
  "value-keyword-case": null,
  "media-feature-range-notation": null,
  "selector-pseudo-class-no-unknown": [
    true,
    {
      ignorePseudoClasses: ["global"],
    },
  ],
};

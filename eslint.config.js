import pluginJs from '@eslint/js';
import * as configMantine from 'eslint-config-mantine';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default {
  files: ['./src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  languageOptions: { globals: globals.browser },
  plugins: {
    pluginJs: pluginJs.configs.recommended,
    tseslint: tseslint.configs.recommended,
    pluginReact: pluginReact.configs.flat.recommended,
    mantine: configMantine,
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    '@typescript-eslint/quotes': 'off',
  },
};

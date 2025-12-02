import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

const sharedRules = {
  'react/react-in-jsx-scope': 'off',
  '@typescript-eslint/no-explicit-any': 'warn',
};

export default [
  { files: ['**/*.{js,mjs,cjs,ts,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: sharedRules,
    ignores: ['.next/**', 'node_modules/**'],
  },
];

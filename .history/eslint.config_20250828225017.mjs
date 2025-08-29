import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});


import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

const eslintConfig = [
  { files: ['**/*.{js,mjs,cjs,ts,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
      // Relax a few rules for the app during local development to reduce noise.
      rules: {
        // The project uses the new JSX transform and Next.js app router; React in scope rule is noisy.
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unused-expressions': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        // Allow some `any` usage in generated or legacy helper files to avoid overwhelming errors.
        '@typescript-eslint/no-explicit-any': 'off'
      },
      ignores: ['.next/**', 'src/.next/**', 'node_modules/**'],
    },
];

export default eslintConfig;

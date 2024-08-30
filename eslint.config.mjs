import eslint from '@eslint/js';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsEslintParser from '@typescript-eslint/parser';
import PluginImport from 'eslint-plugin-import-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

// 0-off 1-warn 2-error
const globalRules = {
  'prettier/prettier': 2,
  'max-len': [
    'error',
    {
      code: 120,
      tabWidth: 2,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreRegExpLiterals: true,
      ignoreTemplateLiterals: true,
    },
  ],
  'import/first': 2,
  'import/no-duplicates': 2,
  'import/no-mutable-exports': 2,
  'import/no-named-default': 2,
  'import/no-self-import': 2,
  'import/no-default-export': 2,
  'import/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    },
  ],
  '@typescript-eslint/no-explicit-any': 0,
  '@typescript-eslint/no-non-null-assertion': 2,
};
// 使用tsEslintParser自定义配置
export const customTsFlatConfig = [
  {
    name: 'typescript-eslint/base',
    languageOptions: {
      parser: tsEslintParser,
      sourceType: 'module',
    },
    files: ['**/*.{ts,tsx}'],
    rules: {
      ...tsEslintPlugin.configs.recommended.rules,
      ...globalRules,
    },
    plugins: {
      // ts 语法特有的规则，例如泛型
      '@typescript-eslint': tsEslintPlugin,
    },
  },
];

const flatConfig = [
  {
    name: 'react-eslint',
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      ...reactPlugin.configs.recommended.languageOptions,
      // parserOptions: {
      //   ecmaFeatures: {
      //     jsx: true,
      //   },
      // },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 0,
    },
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
    },
  },
  // 全局生效的规则
  {
    name: 'global config',
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.es2022,
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    plugins: {
      import: PluginImport,
    },
    rules: globalRules,
  },
  {
    ignores: ['dist'],
  },
];

export default tsEslint.config(
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  ...tsEslint.configs.recommended,
  ...flatConfig
);

// export default [eslint.configs.recommended, eslintPluginPrettierRecommended, ...flatConfig, ...customTsFlatConfig];

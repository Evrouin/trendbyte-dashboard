import { defineConfig } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default defineConfig([
  {
    ignores: ['.nuxt/**', '.output/**', 'node_modules/**'],
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
      },
    },
    plugins: { vue: pluginVue },
    rules: {
      ...pluginVue.configs['flat/essential'].rules,
      'no-console': 'warn',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      'no-console': 'warn',
    },
  },
])

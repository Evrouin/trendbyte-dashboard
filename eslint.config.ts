import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{ts,vue}'],
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off',
    },
  },
])

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        // В монорепо несколько tsconfig.json — фиксируем корень явно,
        // иначе typescript-eslint не может вывести tsconfigRootDir.
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Сгенерированные shadcn-компоненты экспортируют и компоненты, и
  // вспомогательные константы (cva-варианты) — fast refresh не применяется.
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])

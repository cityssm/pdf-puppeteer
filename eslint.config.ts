import eslintConfigCityssm, {
  type Config,
  cspellWords,
  tseslint
} from 'eslint-config-cityssm'

const config = tseslint.config(eslintConfigCityssm, {
  files: ['**/*.ts', '**/*.js'],
  rules: {
    '@cspell/spellchecker': [
      'warn',
      {
        cspell: {
          words: [...cspellWords, 'domcontentloaded', 'networkidle0']
        }
      }
    ]
  }
}) as Config

export default config

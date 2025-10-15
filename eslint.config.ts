import { cspellWords } from 'eslint-config-cityssm/exports.js'
import eslintConfigCityssm, {
  type ConfigObject,
  defineConfig
} from 'eslint-config-cityssm/packageConfig'

const config: ConfigObject[] = defineConfig(eslintConfigCityssm, {
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
})

export default config

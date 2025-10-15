import { cspellWords } from 'eslint-config-cityssm/exports.js';
import eslintConfigCityssm, { defineConfig } from 'eslint-config-cityssm/packageConfig';
const config = defineConfig(eslintConfigCityssm, {
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
});
export default config;

import eslintConfigCityssm, { cspellWords, tseslint } from 'eslint-config-cityssm';
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
});
export default config;

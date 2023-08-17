/* eslint-env node */
module.exports = {
  extends: ['@dcl/eslint-config/dapps'],
  parserOptions: {
    project: ['tsconfig.json']
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '@typescript-eslint/naming-convention': [
          'error',
          { selector: 'enumMember', format: ['UPPER_CASE'] },
          {
            selector: 'objectLiteralProperty',
            format: ['snake_case', 'camelCase', 'UPPER_CASE'],
            filter: {
              regex: '^.+-.+$',
              match: false
            }
          }
        ]
      }
    }
  ]
}

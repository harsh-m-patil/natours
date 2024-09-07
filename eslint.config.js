import globals from 'globals'
import node from 'eslint-plugin-node'
import prettier from 'eslint-plugin-prettier'
import pluginJs from '@eslint/js'

export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    plugins: {
      prettier,
      node,
    },

    rules: {
      'prettier/prettier': 'error',
      'spaced-comment': 'off',
      'no-console': 'warn',
      'consistent-return': 'off',
      'func-names': 'off',
      'object-shorthand': 'off',
      'no-process-exit': 'off',
      'no-param-reassign': 'off',
      'no-return-await': 'off',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',

      'prefer-destructuring': [
        'error',
        {
          object: true,
          array: false,
        },
      ],

      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: 'req|res|next|val|err',
        },
      ],
    },
  },
]

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: [ '@typescript-eslint' ],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'semi': [ 1, "always" ],
    'comma-spacing': [ 1, { "before": false, "after": true } ],
    'key-spacing': [ 1, { "beforeColon": false, "afterColon": true } ],
    'keyword-spacing': [ 1, { "before": true, "after": true } ],
    'space-before-blocks': 1,
    '@typescript-eslint/no-var-requires': "off"
  },
  globals: {
    $: true
  }
};

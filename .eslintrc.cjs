
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended', // Vue3の推奨ルール
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // 開発を止めないための緩め設定（必要に応じて調整）
    'no-unused-vars': 'warn',           // 未使用変数は警告にとどめる
    'vue/multi-word-component-names': 'off', // HomeView や App などの単一単語コンポーネント名を許容
    'vue/max-attributes-per-line': 'off',    // 1行あたりの属性数制限を解除
    'vue/singleline-html-element-content-newline': 'off',
  },
}
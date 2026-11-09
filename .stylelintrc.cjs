module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  rules: {
    // 厳しすぎるルールは適宜オフにする
    'selector-class-pattern': null, // BEM記法（__や--）を許可
    'no-empty-source': null,
  },
}
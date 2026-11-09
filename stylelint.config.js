export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  rules: {
    // 厳しすぎるルールは適宜オフにする

    // rgba(r, g, b, a) 記法を許可
    'color-function-notation': null,
    'alpha-value-notation': null,
    'color-function-alias-notation': null,

    // メディアクエリを従来の (max-width: px) を許可
    'media-feature-range-notation': null,

    // 空行の強制をオフにする
    'comment-empty-line-before': null,
    'rule-empty-line-before': null,

    // BEM記法を許可
    'selector-class-pattern': null,
    'no-empty-source': null,
  },
}
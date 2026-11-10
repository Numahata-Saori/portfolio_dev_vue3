export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
  ],
  rules: {
    // 厳しすぎるルールは適宜オフにする

    // 廃止された古いルールの警告を消す
    'at-charset-rule-no-invalid': null,
    'value-no-invalid': null,

    // 開発効率を優先して過剰なルールをオフにする
    'no-descending-specificity': null, // 詳細度の並び順チェックを無効化
    'property-no-vendor-prefix': null, // -webkit-mask-image 等のプレフィックスを許可
    'declaration-empty-line-before': null, // プロパティ間の空行を許可
    'keyframes-name-pattern': null, // @keyframes scrollDown などの命名を許可
    'color-hex-length': null, // カラーコードを短縮強制しない
    'declaration-block-no-redundant-longhand-properties': null,

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
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
  ],
  rules: {
    // 厳しすぎるルールは適宜オフにする

    // 重複・不要コードの防止
    'declaration-block-no-duplicate-properties': [
      true,
      {
        // 異なる値でのフォールバック上書きのみ許可
        ignore: ['consecutive-duplicates-with-different-values'],
      },
    ],
    'declaration-block-no-duplicate-custom-properties': true, // CSS変数の重複禁止
    'no-duplicate-selectors': true, // セレクタ重複禁止
    'no-duplicate-at-import-rules': true, // @importの重複禁止
    'block-no-empty': true, // 空ブロック禁止

    /**
     * タイポ・未知構文の防止
     */
    'property-no-unknown': true, // プロパティのスペルミス検知
    'unit-no-unknown': true,     // 単位のスペルミス検知
    'selector-pseudo-class-no-unknown': [
      true,
      {
        // Vue 3 の scoped CSS 特有の疑似クラスを許可
        ignorePseudoClasses: ['deep', 'slotted', 'global'],
      },
    ],
    'font-family-no-missing-generic-family-keyword': true, // sans-serif等の指定漏れ防止

    // 命名規則
    'custom-property-pattern': '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$', // CSS変数はケバブケースを強制
    'selector-class-pattern': null, // BEM記法を許可

    /**
     * 表記法
     */
    // rgba(r, g, b, a) 記法を許可
    'alpha-value-notation': null, // α値には数値表記
    'color-function-notation': null, // 色関数は従来の表記
    'color-function-alias-notation': null, // 色関数のエイリアス表記

    'color-hex-length': null, // カラーコードを短縮強制しない
    "color-hex-case": 'lower', // カラーコードを小文字に統一
    // 'selector-pseudo-element-colon-notation': 'single',
    'string-quotes': 'single', // シングルクォートに統一

    /**
     * 無効
     */

    // 開発効率を優先して過剰なルールをオフにする
    'no-descending-specificity': null, // 詳細度の並び順チェックを無効化
    'property-no-vendor-prefix': null, // -webkit-mask-image 等のプレフィックスを許可
    'declaration-empty-line-before': null, // プロパティ間の空行を許可

    'declaration-block-no-redundant-longhand-properties': null,

    // メディアクエリを従来の (max-width: px) を許可
    'media-feature-range-notation': null,

    // 空行の強制をオフにする
    'comment-empty-line-before': null,
    'rule-empty-line-before': null,

    'no-empty-source': null, // 空のsauce禁止
  },
}
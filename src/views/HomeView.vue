<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { animate, stagger } from 'animejs'

const heroTitle = 'ENGINEERING & DESIGN'
const titleChars = heroTitle.split('')

const works = ref([]) // APIから取得したデータの配列を保持
const loading = ref(true) // 通信中かどうかを判定
const errorMsg = ref(null) // 通信失敗時のエラー分を保持

// WordPress REST API連携
// 初期表示された直後1回だけ自動実行
onMounted(async () => {
  // ページ初期表示
  animate('.hero__intro', {
    opacity: [0, 1],
    translateY: [-10, 0],
    duration: 600,
    ease: 'outQuad',
  })

  // タイトル文字
  animate('.hero__title .char', {
    opacity: [0, 1],
    translateY: [40, 0],
    scale: [0.6, 1],
    rotateZ: () => [(Math.random() - 0.5) * 30, 0], // 各文字が少し傾いた状態から整列
    delay: stagger(35, { from: 'random', start: 100 }), // ランダムな順序でパラパラと出現
    duration: 800,
    ease: 'outExpo',
  })

  animate('.hero__lead', {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 700,
    delay: 500,
    ease: 'outCubic',
  })

  animate('.hero-skill__item', {
    opacity: [0, 1],
    translateY: [16, 0],
    delay: stagger(100, { start: 650 }),
    duration: 600,
    ease: 'outQuad',
  })

  // 実績データ取得
  try {
    // サーバーからJSONデータ取得
    const res = await fetch('https://dev.shaorim.com/wp-json/wp/v2/works?_embed') // ?_embedWPは WP REST APIのパラメータ
    if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`)
    const data = await res.json()
    works.value = data

    loading.value = false // 読み込み中を解除

    await nextTick() // works.valueを取得後に、非同期のDOM再描画

    // 実績一覧のアニメーション
    animate('.works-list__item', {
      opacity: [0, 1], // 透明度：0 → 1
      translateY: [32, 0], // Y軸位置：32px下 → 元の位置
      delay: stagger(100, { start: 150 }), // 1枚ごとに100msずつ遅延（150ms後に開始）
      duration: 1200, // アニメーション時間
      ease: 'outExpo', // アニメーション速度
    })
  } catch (err) {
    errorMsg.value = `データの取得に失敗しました: ${err.message}`
    loading.value = false
  }
})
</script>

<template>
  <div class="home-view">
    <section class="hero common">
      <div class="common-inner">
        <p class="hero__intro">SAORI NUMAHATA - FRONT-END DEVELOPER</p>
        <h2 class="hero__title" aria-label="ENGINEERING & DESIGN">
          <!-- aria-hidden でスクリーンリーダーの重複読み上げを防止 -->
          <span
            v-for="(char, index) in titleChars"
            :key="index"
            class="char"
            aria-hidden="true"
          >
            {{ char === ' ' ? '\u00A0' : char }}
          </span>
        </h2>

        <p class="hero__lead">
          10年以上機械・CAD設計で培ったを土台に、現在はフロントエンドエンジニアとして実装を担当しています。<br>
          デザインの意図を正確に汲み取り、崩れにくく保守しやすいコードを組むことを心がけています。
        </p>

        <div class="hero-skill">
          <div class="hero-skill__item">
            <span class="hero-skill__label">EXP</span>
            <span class="hero-skill__text">機械設計 10年以上 → Webフロントエンド 4年</span>
          </div>
          <div class="hero-skill__item">
            <span class="hero-skill__label">CORE</span>
            <span class="hero-skill__text">HTML/Scss (BEM) / JavaScript / WordPress / Vue 3</span>
          </div>
          <div class="hero-skill__item">
            <span class="hero-skill__label">SCOPE</span>
            <span class="hero-skill__text">一人完結（ヒアリング〜納品） / 仕様書ベースの受託実装</span>
          </div>
        </div>
      </div>
    </section>

    <section class="works common">
      <div class="common-inner">
        <div class="section-heading">
          <h2 class="section-title">Works</h2>
        </div>

        <div v-if="loading" class="state-text">実績データを読み込み中...</div>
        <div v-else-if="errorMsg" class="state-text error">{{ errorMsg }}</div>

        <div v-else class="works-list">
          <article v-for="item in works" :key="item.id" class="works-list__item">
            <RouterLink :to="`/works/${item.id}`" class="works-list__link">
              <div class="works-list__thumb">
                <img
                  v-if="item._embedded?.['wp:featuredmedia']?.[0]?.source_url"
                  :src="item._embedded['wp:featuredmedia'][0].source_url"
                  :alt="item.title.rendered"
                  class="works-list__thumb-img"
                />
                <div v-else class="works-list__thumb-img no-image">No Image</div>
              </div>

              <div class="works-list__body">
                <h3 class="works-list__title">{{ item.title.rendered }}</h3>
                <p v-if="item.acf?.works_stack" class="works-list__stack">
                  <strong>Stack：</strong>{{ item.acf.works_stack }}
                </p>
              </div>
            </RouterLink>
          </article>
        </div>
      </div>
    </section>

    <section class="skills common">
      <div class="common-inner">
        <div class="section-heading">
          <h2 class="section-title">Core Skills & Scope</h2>
          <!-- <p class="section-lead">設計業務で培った品質意識を基盤とした、実装スキルと対応領域です。</p> -->
        </div>

        <div class="skills__contents">
          <div class="skills__box">
            <div class="card-header-line">
              <span class="skills__lead">FRONT-END</span>
              <h3 class="skills__title">フロントエンド実装</h3>
            </div>
            <ul class="skills__list">
              <li class="skills__item">
                <strong>破綻のないCSS設計:</strong>
                BEMやSMACSSをベースに、命名規則や入れ子を整理したScss設計で、改修しやすく保守性の高いコードを実装します。
              </li>
              <li class="skills__item">
                <strong>動的UI・インタラクション:</strong>
                JavaScript（ES6+）を用いた各種UI実装をはじめ、案件要件に応じてライブラリ選定から組み込みまで柔軟に対応します。
              </li>
              <li class="skills__item">
                <strong>モダン環境のキャッチアップ:</strong>
                Vue 3によるコンポーネント指向開発や、Three.js / Anime.js を活用した軽快なモーション・WebGL演出の実装に対応します。
              </li>
            </ul>
          </div>

          <div class="skills__box">
            <div class="card-header-line">
              <span class="skills__lead">CMS / BACK-END</span>
              <h3 class="skills__title">WordPress / 設計構築</h3>
            </div>
            <ul class="skills__list">
              <li class="skills__item">
                <strong>運用を見据えた独自テーマ構築:</strong>
                ゼロからのオリジナルテーマ構築はもちろん、ACFやカスタム投稿を設計し、クライアントが管理画面から迷わず更新できる設計を徹底します。
              </li>
              <li class="skills__item">
                <strong>機能実装・API連携:</strong>
                PHPを用いた基本的な動的処理（テンプレート共通化・フォーム連携）や、REST API経由でのフロントエンド連携に対応します。
              </li>
              <li class="skills__item">
                <strong>環境構築と納品整備:</strong>
                ローカル開発環境から本番サーバーへの移行、既存テーマの改修や不具合調査など安全な運用保守を意識して対応します。
              </li>
            </ul>
          </div>

          <div class="skills__box full-width">
            <div class="card-header-line">
              <span class="skills__lead highlight">SCOPE</span>
              <h3 class="skills__title">実務対応領域・進め方</h3>
            </div>
            <div class="scope-columns">
              <div class="scope-columns__item">
                <h4 class="scope-columns__title">完全一人対応での案件完結</h4>
                <p class="scope-columns__desc">
                  フリーランスでの受託経験を活かし、要件のヒアリングから進行管理、コーディング、サーバー公開設定、納品まで一気通貫で責任を持って対応した実績があります。
                </p>
              </div>
              <div class="scope-columns__item">
                <h4 class="scope-columns__title">仕様書に基づく高精度な受託実装</h4>
                <p class="scope-columns__desc">
                  制作会社からの下請け案件において、支給デザインや仕様書の意図を正確に汲み取り、ブラウザ検証や表示崩れのない検品精度の高いデータ納品を行っています。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 共通 */
.common {
  padding: 5rem 0;
  width: 100%;
}
.common-inner {
  margin: 0 auto;
}

/* hero */
.hero {
  padding: 60px 0 70px;
}

.hero__intro {
  opacity: 0;
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  font-weight: 700;
  color: #00aa6e;
  margin: 0 0 16px;
}

.hero__title {
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: #0f172a;
  margin: 0 0 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.hero__title .char {
  display: inline-block;
  opacity: 0;
  will-change: transform, opacity;
}

.hero__lead {
  opacity: 0;
  font-size: 1rem;
  line-height: 1.8;
  color: #475569;
  margin: 0;
}

/* hero スキル */
.hero-skill {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 24px;
}

.hero-skill__item {
  opacity: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-left: 3px solid #00aa6e;
  border-radius: 6px;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}

.hero-skill__label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #0f172a;
  background: #e2e8f0;
  padding: 2px 8px;
  border-radius: 4px;
  min-width: 44px;
  text-align: center;
}

.hero-skill__text {
  color: #475569;
  font-weight: 500;
  line-height: 1.5;
}


/* section見出し */
.section-heading {
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  padding-bottom: 12px;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: 0.02em;
}

/* 状態 */
.state-text {
  font-size: 1.1rem;
  padding: 40px 0;
  text-align: center;
}
.state-text.error {
  color: #e53935;
}

/* 実績 */
.works {
  padding-top: 20px;
}

.works-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
.works-list__item {
  opacity: 0;
  transform: translateY(32px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  will-change: transform, opacity;
}
.works-list__item:hover {
  transform: translateY(-6px) !important;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

/* 実績 リンク */
.works-list__link {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* 実績 サムネイル画像 */
.works-list__thumb {
  width: 100%;
  height: 180px;
  background: #f1f5f9;
  overflow: hidden;
  position: relative;
}
.works-list__thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1);
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}
.works-list__item:hover .works-list__thumb-img {
  transform: scale(1.05);
}
.works-list__thumb-img.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.9rem;
}

/* 実績 詳細 */
.works-list__body {
  padding: 18px;
}
.works-list__title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0 0 8px;
  color: #0f172a;
}
.works-list__stack {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.skills {
  padding-bottom: 40px;
}

.skills__contents {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.skills__box {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(226, 232, 240, 0.85);
  border-radius: 12px;
  padding: 24px 26px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.skills__box.full-width {
  grid-column: 1 / -1;
  border-top: 2px solid #0066cc;
}

.card-header-line {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.skills__lead {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #0066cc;
  background: rgba(0, 102, 204, 0.08);
  padding: 3px 8px;
  border-radius: 4px;
}

.skills__lead.highlight {
  color: #00aa6e;
  background: rgba(0, 170, 110, 0.1);
}

.skills__title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.skills__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.skills__list li {
  font-size: 0.92rem;
  line-height: 1.7;
  color: #475569;
  position: relative;
  padding-left: 16px;
}

.skills__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #00aa6e;
}

.skills__list li strong {
  color: #0f172a;
  font-weight: 600;
  display: inline;
}

/* スコープ（2列構成） */
.scope-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.scope-columns__title {
  font-size: 0.98rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.scope-columns__title::before {
  content: '✓';
  color: #00aa6e;
  font-weight: 800;
}

.scope-columns__desc {
  font-size: 0.9rem;
  line-height: 1.75;
  color: #475569;
  margin: 0;
}
</style>
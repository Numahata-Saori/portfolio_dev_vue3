<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { animate, stagger } from 'animejs'

const heroTitle = 'ENGINEERING & DESIGN'
const titleChars = heroTitle.split('')

const works = ref([]) // APIから取得したデータの配列を保持
const loading = ref(true) // 通信中かどうかを判定
const errorMsg = ref(null) // 通信失敗時のエラー分を保持


// 初期表示された直後1回だけ自動実行
onMounted(async () => {
  // ページ初期表示
  animate('.fv__intro', {
    opacity: [0, 1],
    translateY: [-10, 0],
    duration: 600,
    ease: 'outQuad',
  })

  // タイトル文字
  animate('.fv__title .char', {
    opacity: [0, 1],
    translateY: [40, 0],
    scale: [0.6, 1],
    rotateZ: () => [(Math.random() - 0.5) * 30, 0], // 各文字が少し傾いた状態から整列
    delay: stagger(35, { from: 'random', start: 100 }), // ランダムな順序でパラパラと出現
    duration: 800,
    ease: 'outExpo',
  })

  animate('.fv__scroll', {
    opacity: [0, 1],
    duration: 800,
    delay: 1000,
    ease: 'outQuad',
  })

  /**
   * スクロール監視の共通関数
   * @param selector
   * @param onEnter
   */
  const observeElement = (selector, onEnter) => {
    const el = document.querySelector(selector)
    if (!el) return

    // 要素が画面に入ってきたら検知
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 要素が画面内に20%ほど入ってきたら発火
          if (entry.isIntersecting) {
            onEnter()
            observer.unobserve(entry.target) // 1回発火したら監視を解除して負荷軽減
          }
        })
      },
      { threshold: 0.2 } // 20%見えたらトリガー
    )
    observer.observe(el)
  }

  observeElement('.hero', () => {
    animate('.hero__lead', {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      ease: 'outCubic',
    })

    animate('.hero-skill__item', {
      opacity: [0, 1],
      translateY: [16, 0],
      delay: stagger(100, { start: 150 }),
      duration: 1000,
      ease: 'outQuad',
    })
  })

  observeElement('.skills__contents', () => {
    animate('.skills__box', {
      opacity: [0, 1],
      translateY: [16, 0],
      delay: stagger(100, { start: 150 }),
      duration: 1000,
      ease: 'outQuad',
    })
  })

  /**
   * 実績データ取得
   * WordPress REST API連携
   */
  try {
    // サーバーからJSONデータ取得
    const res = await fetch('https://dev.shaorim.com/wp-json/wp/v2/works?_embed') // ?_embedWPは WP REST APIのパラメータ
    if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`)
    const data = await res.json()
    works.value = data

    loading.value = false // 読み込み中を解除

    await nextTick() // works.valueを取得後に、非同期のDOM再描画

    observeElement('.featured-work', () => {
      animate('.featured-work__content', {
        opacity: [0, 1],
        translateY: [24, 0],
        delay: stagger(100),
        duration: 1000,
        ease: 'outExpo',
      })
    })

    observeElement('.other-works__contents', () => {
      animate('.other-works__item', {
        opacity: [0, 1], // 透明度：0 → 1
        translateY: [32, 0], // Y軸位置：32px下 → 元の位置
        delay: stagger(100, { start: 150 }), // 1枚ごとに100msずつ遅延（150ms後に開始）
        duration: 1000, // アニメーション時間
        ease: 'outExpo', // アニメーション速度
      })
    })

  } catch (err) {
    errorMsg.value = `データの取得に失敗しました: ${err.message}`
    loading.value = false
  }
})

const scrollToSection = (targetId) => {
  const target = document.querySelector(targetId)
  if (!target) return // IDなければ終了

  // 固定ヘッダーの実際の高さを取得
  const header = document.querySelector('.js_header_hight')
  const headerHeight = header ? header.offsetHeight : 0

  // ターゲット要素のドキュメント絶対Y座標 - ヘッダーの高さ
  const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div class="home-view">
    <section class="fv">
      <div class="fv__inner">
        <p class="fv__intro txt-en">SAORI NUMAHATA — FRONT-END DEVELOPER</p>

        <h1 class="fv__title txt-en" aria-label="ENGINEERING & DESIGN">
          <span v-for="(char, index) in titleChars" :key="index" class="char" aria-hidden="true">
            {{ char === ' ' ? '\u00A0' : char }}
          </span>
        </h1>
      </div>

      <a href="#hero" class="fv__scroll" @click.prevent="scrollToSection('#hero')">
        <span class="fv__scroll-text txt-en">SCROLL</span>
        <span class="fv__scroll-line"></span>
      </a>
    </section>

    <section id="hero" class="hero common">
      <div class="common-inner">
        <p class="hero__lead">
          10年以上機械・CAD設計で培ったを土台に、<br class="xl-none-br">現在はフロントエンドエンジニアとして実装を担当しています。<br>
          デザインの意図を正確に汲み取り、<br class="xl-none-br">崩れにくく保守しやすいコードを組むことを心がけています。
        </p>

        <div class="hero-skill">
          <div class="hero-skill__item border-frames">
            <p class="hero-skill__label txt-en">EXP</p>
            <p class="hero-skill__text">機械設計 10年以上<span class="arrow"></span>Webフロントエンド 4年</p>
          </div>
          <div class="hero-skill__item border-frames">
            <p class="hero-skill__label txt-en">CORE</p>
            <p class="hero-skill__text"><span>HTML / CSS / Scss (BEM)</span><span>JavaScript / jQuery</span><span>PHP / WordPress</span><span>Vue / Three.js etc.</span></p>
          </div>
          <div class="hero-skill__item border-frames">
            <p class="hero-skill__label txt-en">SCOPE</p>
            <p class="hero-skill__text"><span>一人完結（ヒアリング〜納品）</span><span>仕様書ベースの受託実装</span></p>
          </div>
        </div>
      </div>
    </section>

    <div class="bg-grid">
      <section class="works common">
        <div class="common-inner">
          <div class="section-heading">
            <h2 class="section-title txt-en">WORKS</h2>
          </div>

          <article class="featured-work intersecting-frames-wrapper">
            <div class="intersecting-frames">
              <div class="featured-work__box intersecting-frames-inner">
                <div class="featured-work__heading">
                  <h3 class="featured-work__heading-text txt-en">FEATURED CASE</h3>
                </div>

                <p class="featured-work__category txt-en">Web Design & Front-End</p>

                <div class="featured-work__content">
                  <div class="featured-work__visual">
                    <div class="browser-mock">
                      <div class="browser-mock__bar">
                        <span class="browser-mock__dot"></span>
                        <span class="browser-mock__dot"></span>
                        <span class="browser-mock__dot"></span>
                        <span class="browser-mock__address">https://intro.autohub-dev.com/</span>
                      </div>
                      <div class="browser-mock__viewport">
                        <img
                          src="/autohub_lp1.png"
                          alt="中古車輸出事業会社 LP 全体スクリーンショット"
                          class="browser-mock__image"
                          loading="lazy"
                        />
                        <div class="browser-mock__hint txt-en">
                          <span>SCROLL TO VIEW</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="featured-info">
                    <h3 class="featured-info__title">中古車輸出事業会社 LP</h3>

                    <div class="featured-meta">
                      <div class="featured-meta__item">
                        <span class="featured-meta__label txt-en">Scope</span>
                        <span class="featured-meta__text">要件ヒアリング / 構成案・デザイン / コーディング一式（完全一人対応）</span>
                      </div>
                      <div class="featured-meta__item">
                        <span class="featured-meta__label txt-en">Stack</span>
                        <span class="featured-meta__text">HTML / CSS (BEM) / JavaScript / レスポンシブ対応<br>figma / Photoshop</span>
                      </div>
                      <div class="featured-meta__item">
                        <span class="featured-meta__label txt-en">Results</span>
                        <span class="featured-meta__text">ゼロからの専用LP立ち上げにより、公開後半年で累計50〜70件超の新規問い合わせを獲得</span>
                      </div>
                    </div>

                    <div class="featured-points">
                      <h4 class="featured-points__title">設計・実装におけるこだわり</h4>
                      <dl class="featured-points__list">
                        <div class="featured-points__item">
                          <dt>ゼロからのWeb導線確立（AIDCAS設計）</dt>
                          <dd>
                            元々は受け皿となる専用ページがなかったため、AIDCAS（注目・興味・欲求・確信・行動）に準拠した情報設計を実施。初めて訪れたユーザーでも不安なく問い合わせに至る導線をゼロから構築しました。
                          </dd>
                        </div>
                        <div class="featured-points__item">
                          <dt>「海と船」のコンセプトを表現する波シェイプ</dt>
                          <dd>
                            船の写真を大胆に使用しつつ、セクション境界に波シェイプを採用。「スクロールするほど船で目的地（お問い合わせ）へ近づいていく」ストーリー性を持たせ、離脱を防ぐ工夫を施しました。
                          </dd>
                        </div>
                        <div class="featured-points__item">
                          <dt>崩れのない堅牢なレスポンシブコーディング</dt>
                          <dd>
                            スマートフォンからPCまで閲覧環境を問わず世界観を損なわないよう、波の形状やフォントサイズのブレークポイントを綿密に設計。ヒアリングから納品まで責任を持って一人で完結させました。
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div class="other-works">
            <div class="other-works__heading">
              <h3 class="other-works__heading-text txt-en">OTHER WORKS</h3>
            </div>

            <div v-if="loading" class="state-text">実績データを読み込み中...</div>
            <div v-else-if="errorMsg" class="state-text error">{{ errorMsg }}</div>

            <div v-else class="other-works__contents">
              <article v-for="item in works" :key="item.id" class="other-works__item">
                <RouterLink :to="`/works/${item.id}`" class="other-works__link">
                  <div class="other-works__thumb">
                    <img
                      v-if="item._embedded?.['wp:featuredmedia']?.[0]?.source_url"
                      :src="item._embedded['wp:featuredmedia'][0].source_url"
                      :alt="item.title.rendered"
                      class="other-works__thumb-img"
                    />
                    <div v-else class="other-works__thumb-img no-image">No Image</div>
                  </div>

                  <div class="other-works__body">
                    <h3 class="other-works__title">{{ item.title.rendered }}</h3>
                    <p v-if="item.acf?.works_stack" class="other-works__stack">
                      <strong>Stack：</strong>{{ item.acf.works_stack }}
                    </p>
                  </div>
                </RouterLink>
              </article>
            </div>
          </div>

          <div class="private-works intersecting-frames-wrapper">
            <div class="intersecting-frames">
              <div class="private-works__box intersecting-frames-inner">
                <div class="private-works__headline-area">
                  <div class="private-works__headline">
                    <span class="private-works__title-en txt-en">CONFIDENTIAL</span>
                    <h3 class="private-works__title">守秘義務案件</h3>
                  </div>
                  <p class="private-works__count txt-en">（全10件中7件）</p>
                  <p class="private-works__desc">
                    ※ クライアントワークの都合上、Web上での一般公開を控えております。<br>
                    <!-- ご担当者様との面談時に、ぼかし処理済みの詳細資料・キャプチャを直接ご提示いたします。 -->
                  </p>
                </div>

                <div class="private-works__list">
                  <article class="private-works__item private-works-detail border-frames">
                    <div class="private-works-detail__headline">
                      <span class="private-works-detail__tag">リニューアル</span>
                      <h4 class="private-works-detail__title">映像制作会社 コーポレートサイト（トップページ ＋ 下層4P）</h4>
                    </div>
                    <dl class="private-works-detail__list">
                      <div class="private-works-detail__item">
                        <dt>課題</dt>
                        <dd>古いデザインの一新と、実績をしっかり見せられるコーポレートサイトにしたい。</dd>
                      </div>
                      <div class="private-works-detail__item">
                        <dt>解決</dt>
                        <dd>シンプルさを保ちつつ、背景動画とアニメーションで先進性とクリエイティブさを表現。</dd>
                      </div>
                      <div class="private-works-detail__item">
                        <dt>工夫</dt>
                        <dd>静と動のコントラストを意識した動きのあるトップページに。実績ページではサムネイルを大きく配置し、視覚的に実績を訴求。</dd>
                      </div>
                    </dl>
                  </article>

                  <article class="private-works__item private-works-detail border-frames">
                    <div class="private-works-detail__headline">
                      <span class="private-works-detail__tag">リニューアル</span>
                      <h4 class="private-works-detail__title">子供向けダンス教室 ホームページ（トップページ ＋ 下層9P）</h4>
                    </div>
                    <dl class="private-works-detail__list">
                      <div class="private-works-detail__item">
                        <dt>課題</dt>
                        <dd>既存のイメージから、子供・保護者に親しみやすいポップなサイトに変えたい。</dd>
                      </div>
                      <div class="private-works-detail__item">
                        <dt>解決</dt>
                        <dd>パステルカラー基調 ＋ 丸ゴシック体で可愛らしさを演出し、スマホファーストで設計。</dd>
                      </div>
                      <div class="private-works-detail__item">
                        <dt>工夫</dt>
                        <dd>アイコン多用・角丸デザイン・フローティングフッターで直感操作を実現。保護者が欲しい情報（料金・スケジュール）にすぐ辿り着ける構成に。</dd>
                      </div>
                    </dl>
                  </article>

                  <article class="private-works__item private-works-detail border-frames">
                    <div class="private-works-detail__headline">
                      <span class="private-works-detail__tag">リニューアル</span>
                      <h4 class="private-works-detail__title">古美術買取専門店 ホームページ（トップページ ＋ 下層1P）</h4>
                    </div>
                    <dl class="private-works-detail__list">
                      <div class="private-works-detail__item">
                        <dt>課題</dt>
                        <dd>素人感の強い既存サイトを、高級感のある信頼できるサイトに作り直したい。</dd>
                      </div>
                      <div class="private-works-detail__item">
                        <dt>解決</dt>
                        <dd>メインカラーを黒に統一し、落ち着いたシンプルで上質な印象に再構築。</dd>
                      </div>
                      <div class="private-works-detail__item">
                        <dt>工夫</dt>
                        <dd>余白を贅沢に使い、明朝体＋線や和のあしらいで日本らしい品格を演出。ターゲット層が安心感を抱くよう、情報整理と視認性を徹底。</dd>
                      </div>
                    </dl>
                  </article>

                  <ul class="private-works-simple">
                    <li class="private-works-simple__item">
                      <p>美容整形クリニック スマホ専用LP（SPデザインのみ / Figma納品）</p>
                    </li>
                    <li class="private-works-simple__item">
                      <p>清掃管理事業 コーポレートサイト新規構築（WPオリジナルテーマ）</p>
                    </li>
                    <li class="private-works-simple__item">
                      <p>体型改善ダイエット講座 LP新規制作（WPオリジナルテーマ）</p>
                    </li>
                    <li class="private-works-simple__item">
                      <p>ネイルサロン コーポレートサイト新規構築</p>
                    </li>
                  </ul>
                </div>

                <div class="private-works__bottom">
                  <p class="private-works__note">
                    <span class="private-works__check">✓</span>
                    上記案件はすべて <strong>一人対応（ヒアリング〜デザイン・オリジナルテーマ実装・公開）</strong> にて担当
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="skills common">
        <div class="common-inner">
          <div class="section-heading">
            <h2 class="section-title txt-en">SKILLS & SCOPE</h2>
            <!-- <p class="section-lead">設計業務で培った品質意識を基盤とした、実装スキルと対応領域です。</p> -->
          </div>

          <div class="skills__contents">
            <div class="skills__box border-frames">
              <div class="skills__headline">
                <span class="skills__title-en txt-en">FRONT-END</span>
                <h3 class="skills__title">フロントエンド実装</h3>
              </div>
              <ul class="skills__list">
                <li class="skills__item">
                  <strong>破綻のないCSS設計:</strong><br>
                  BEMやSMACSSをベースに、命名規則や入れ子を整理したScss設計で、改修しやすく保守性の高いコードを実装します。
                </li>
                <li class="skills__item">
                  <strong>動的UI・インタラクション:</strong><br>
                  JavaScript（ES6+）を用いた各種UI実装をはじめ、案件要件に応じてライブラリ選定から組み込みまで柔軟に対応します。
                </li>
                <li class="skills__item">
                  <strong>モダン環境のキャッチアップ:</strong><br>
                  Vue 3によるコンポーネント指向開発や、Three.js / Anime.js を活用した軽快なモーション・WebGL演出の実装に対応します。
                </li>
              </ul>
            </div>

            <div class="skills__box border-frames">
              <div class="skills__headline">
                <span class="skills__title-en txt-en">CMS / BACK-END</span>
                <h3 class="skills__title">WordPress / 設計構築</h3>
              </div>
              <ul class="skills__list">
                <li class="skills__item">
                  <strong>運用を見据えた独自テーマ構築:</strong><br>
                  ゼロからのオリジナルテーマ構築はもちろん、ACFやカスタム投稿を設計し、クライアントが管理画面から迷わず更新できる設計を徹底します。
                </li>
                <li class="skills__item">
                  <strong>機能実装・API連携:</strong><br>
                  PHPを用いた基本的な動的処理（テンプレート共通化・フォーム連携）や、REST API経由でのフロントエンド連携に対応します。
                </li>
                <li class="skills__item">
                  <strong>環境構築と納品整備:</strong><br>
                  ローカル開発環境から本番サーバーへの移行、既存テーマの改修や不具合調査など安全な運用保守を意識して対応します。
                </li>
              </ul>
            </div>

            <div class="skills__box full-width border-frames">
              <div class="skills__headline">
                <span class="skills__title-en highlight txt-en">SCOPE</span>
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
  </div>
</template>

<style scoped>
/* FV */
.fv__intro,
.fv__title .char,
.fv__scroll {
  opacity: 0;
}

.fv {
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 0 24px;
  box-sizing: border-box;
}

.fv__inner {
  max-width: 900px;
  margin-top: -30px;
}

.fv__intro {
  font-size: 1.125rem;
  letter-spacing: 0.22em;
  font-weight: 700;
  color: var(--color_accent);
  margin: 0 0 16px;
  text-shadow: 0 2px 10px rgba(253, 224, 71, 0.25);
}

.fv__title {
  font-size: clamp(2.6rem, 6.5vw, 4.0rem);
  font-weight: bold;
  letter-spacing: 0.02em;
  line-height: 1.1;
  color: var(--color_white);
  margin: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
}

.fv__title .char {
  display: inline-block;
  will-change: transform, opacity;
}

/* スクロール誘導 */
.fv__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5rem;
  text-decoration: none;
}

.fv__scroll-text {
  font-size: 0.875rem;
  letter-spacing: 0.25em;
  color: #94a3b8;
  font-weight: 600;
}

.fv__scroll-line {
  width: 1px;
  height: 38px;
  background: linear-gradient(to bottom, var(--color_accent), transparent);
  animation: scrollDown 2s infinite ease-in-out;
}

@keyframes scrollDown {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  50.1% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

@media (max-width: 576px) {
  .fv__inner {
    margin-top: 0;
  }
}



/* hero */
.hero__lead,
.hero-skill__item {
  opacity: 0;
}

.hero__lead {
  color: var(--color_white);
  font-size: 1rem;
  text-align: center;
}

.hero__lead + .hero-skill {
  margin-top: 2rem;
}

.hero-skill {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.hero-skill__item {
  background: var(--color_surface);
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5rem;
  max-width: 800px;
  padding: 1.5rem 1rem;
  width: 100%;
}

.hero-skill__label {
  color: var(--color_accent);
  font-size: 1.75rem;
  font-weight: bold;
  line-height: 1;
}

.hero-skill__text {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hero-skill__text .arrow {
  position: relative;
  display: inline-block;
  width: 1px;
  height: 0.875rem;
  margin: 0 6px;
  border-radius: 100vh;
  background-color: var(--color_sub);
}

.hero-skill__text .arrow::before,
.hero-skill__text .arrow::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: calc(50% - .5px);
  width: 1px;
  height: 8px;
  border-radius: 100vh;
  background-color: var(--color_sub);
  transform-origin: 50% calc(100% - .5px);
}

.hero-skill__text .arrow::before {
  transform: rotate(45deg);
}

.hero-skill__text .arrow::after {
  transform: rotate(-45deg);
}

@media screen and (max-width: 992px) {
  .hero-skill {
    grid-template-columns: 1fr;
  }

  .hero-skill__item {
    max-width: inherit;
  }
}

@media (max-width: 576px) {
  .hero-skill__item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 14px;
  }
}



/* section見出し */
.section-heading {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
}

.section-title {
  font-size: 3rem;
  font-weight: bold;
  display: inline-block;
  line-height: 1;
  margin: 0;
  text-align: center;
}



/* 状態 */
.state-text {
  font-size: 1rem;
  padding: 40px 0;
  text-align: center;
  color: var(--color_text_muted);
}

.state-text.error {
  color: #f87171;
}



.bg-grid {
  background-color: #060d19;
  background-image:
    linear-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212, 175, 55, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center top;
  position: relative;
  z-index: 1;
}

.bg-grid::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background: linear-gradient(to bottom, transparent, #060d19);
  pointer-events: none;
  transform: translateY(-100%);
}



/* 実績 */
.works {
  z-index: 2;
  position: relative;
}

/* 注目作品 */
.featured-work__content {
  opacity: 0;
}

.featured-work {
  margin-bottom: 3.75rem;
  position: relative;
}

.featured-work__box {
  background: var(--color_surface);
  padding: 2rem 2rem;
}

.featured-work__heading {
  color: var(--color_white);
  display: inline-block;
}

.featured-work__heading-text {
  color: var(--color_accent);
  font-size: 1.75rem;
  font-weight: bold;
  line-height: 1;
}

.featured-work__category {
  font-size: 1rem;
  font-weight: bold;
  color: var(--color_text_muted);
  line-height: 1.1;
  margin-bottom: 24px;
  padding-top: .5rem;
}

.featured-work__content {
  display: grid;
  grid-template-columns: 440px 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 992px) {
  .featured-work__box-inner {
    padding: 2rem 1rem;
  }

  .featured-work__content {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

@media (max-width: 576px) {
  .featured-work {
    padding: 24px 18px;
  }

  .featured-work__meta-row {
    flex-direction: column;
    gap: 4px;
  }
}

/* 詳細解説 */
.featured-info__title {
  color: var(--color_accent);
  font-size: 1.45rem;
  font-weight: 700;
  line-height: 1.1;
}

.featured-info__title,
.featured-meta {
  margin-bottom: 1.25rem;
}

.featured-meta {
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 1rem 1rem 0.75rem;
}

.featured-meta__item {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.featured-meta__label {
  color: var(--color_sub);
  font-size: 1.125rem;
  font-weight: bold;
  line-height: 1;
  min-width: 4rem;
}

.featured-meta__text {
  color: var(--color_text_sub);
  font-size: 0.875rem;
}

.featured-points__title {
  color: var(--color_accent);
  font-size: 1.125rem;
  font-weight: bold;
  line-height: 1.1;
  margin-bottom: 0.625rem;
}

.featured-points__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.featured-points__item dt {
  color: var(--color_text_main);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: .5rem;
  margin-bottom: .5rem;
  padding-bottom: 4px;
}

.featured-points__item dt::before {
  content: '◆';
  font-size: 0.65rem;
  color: var(--color_accent);
}

.featured-points__item dd {
  color: var(--color_text_muted);
  font-size: 0.875rem;
}

@media (max-width: 576px) {
  .featured-points__meta-row {
    flex-direction: column;
    gap: 4px;
  }
}



/* PCブラウザ風モックアップ枠 */
.browser-mock {
  background: #0b1329;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.browser-mock__bar {
  background: #1e293b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.browser-mock__dot {
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  width: 9px;
  height: 9px;
}

.browser-mock__dot:nth-child(1) { background: #ef4444; }
.browser-mock__dot:nth-child(2) { background: #f59e0b; }
.browser-mock__dot:nth-child(3) { background: #10b981; }

.browser-mock__address {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-left: 8px;
}

/* スクロール可能なビューポート */
.browser-mock__viewport {
  position: relative;
  height: 520px;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

/* カスタムスクロールバー */
.browser-mock__viewport::-webkit-scrollbar {
  width: 6px;
}
.browser-mock__viewport::-webkit-scrollbar-track {
  background: #070d1e;
}
.browser-mock__viewport::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.4);
  border-radius: 3px;
}
.browser-mock__viewport::-webkit-scrollbar-thumb:hover {
  background: #d4af37;
}

.browser-mock__image {
  width: 100%;
  height: auto;
  display: block;
}

.browser-mock__hint {
  position: sticky;
  bottom: 12px;
  left: 0;
  width: 100%;
  text-align: center;
  pointer-events: none;
}

.browser-mock__hint span {
  color: var(--color_base);
  background: var(--color_accent);
  backdrop-filter: blur(4px);
  padding: 6px 10px 4px;
  border-radius: 100vh;
  font-size: 0.65rem;
  font-weight: bold;
  letter-spacing: 0.15em;
}

@media (max-width: 992px) {
  .browser-mock__viewport {
    height: 420px;
  }
}



/* 実績一覧 */
.other-works__item {
  opacity: 0;
}

.other-works__heading {
  margin-bottom: 1.5rem;
}

.other-works__heading-text {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
  text-align: center;
}

.other-works__contents {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.75rem;
}

.other-works__item {
  transform: translateY(32px);
  overflow: hidden;
  background: var(--color_surface);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  will-change: transform, opacity;
}

.other-works__item:hover {
  transform: translateY(-6px) !important;
  border-color: var(--color_accent);
  box-shadow: 0 0 18px 4px var(--color_accent_tr);
}

.other-works__link {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* 実績 サムネイル画像 */
.other-works__thumb {
  width: 100%;
  height: 180px;
  background: #070d1e;
  overflow: hidden;
  position: relative;
}

.other-works__thumb-img {
  width: 100%;
  height: 100%;
  transform: scale(1);
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.other-works__item:hover .other-works__thumb-img {
  transform: scale(1.05);
}

.other-works__thumb-img.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color_base);
  font-size: 0.875rem;
}

/* 実績 詳細 */
.other-works__body {
  padding: 1.125rem 1rem;
}

.other-works__title {
  color: var(--color_text_main);
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0 0 8px;
}

.other-works__stack {
  font-size: 0.85rem;
  color: var(--color_text_muted);
  margin: 0;
}

@media (max-width: 992px) {
  .other-works {
    gap: 1rem;
  }
}



/* 守秘義務案件 */
.private-works {
  margin-top: 3.75rem;
}
.private-works__box {
  background-color: var(--color_surface);
  padding: 2.5rem 2rem;
}

.private-works__headline-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.private-works__headline {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 4px;
  position: relative;
}

.private-works__title {
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 1.1;
}

.private-works__title-en {
  color: var(--color_accent);
  font-size: 0.75rem;
  opacity: 0.75;
  padding: 3px 8px;
}

.private-works__count {
  color: var(--color_text_muted);
  font-size: 0.85rem;
  margin-bottom: 10px;
}

.private-works__desc {
  color: var(--color_text_muted);
  font-size: 0.875rem;
  text-align: center;
}

/* 案件リスト */
.private-works__list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.private-works__item {
  color: var(--color_text_muted);
}



/* 詳細あり案件 */
.private-works-detail {
  padding: 1rem 1.125rem;
}

.private-works-detail__headline {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.private-works-detail__tag {
  background-color: var(--color_sub);
  border-radius: 4px;
  color: var(--color_white);
  font-size: 0.875rem;
  font-weight: bold;
  line-height: 1;
  padding: 6px 12px;
  white-space: nowrap;
}

.private-works-detail__title {
  color: var(--color_text_main);
  font-size: 1rem;
  font-weight: bold;
}

.private-works-detail__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.private-works-detail__item {
  display: flex;
  gap: 12px;
  font-size: 0.875rem;
  line-height: 1.65;
}

.private-works-detail__item dt {
  color: var(--color_accent);
  font-weight: bold;
  min-width: 2.2rem;
}



/* 他の案件 */
.private-works-simple {
  display: grid;
  gap: .5rem;
  margin-top: 0.5rem;
}

.private-works-simple__item {
  color: var(--color_text_main);
  font-size: 0.875rem;
  padding-left: 1rem;
  position: relative;
}

.private-works-simple__item::before {
  content: '';
  border-radius: 50%;
  background-color: var(--color_accent);
  position: absolute;
  left: 0;
  top: 9px;
  width: 5px;
  height: 5px;
}



.private-works__bottom {
  margin-top: 2rem;
  text-align: right;
}

.private-works__note {
  font-size: 0.875rem;
  color: var(--color_text_muted);
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.private-works__check {
  color: var(--color_sub);
  font-weight: bold;
}



@media (max-width: 992px) {
  .private-works-simple {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .private-works {
    padding: 1.75rem 1.25rem;
  }

  .private-works-detail__headline {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .private-works-detail__item {
    flex-direction: column;
    gap: 2px;
  }

  .private-works__bottom {
    text-align: left;
  }
}



/* スキル */
.skills__contents {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.75rem;
}

.skills__box {
  background: var(--color_surface);
  padding: 1.5rem 1.75rem;
}

.skills__box.full-width {
  grid-column: 1 / -1;
}

.skills__headline {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.skills__title-en {
  color: var(--color_accent);
  font-size: 0.75rem;
  opacity: 0.75;
  /* white-space: nowrap; */
}

.skills__title {
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 1.1;
}

.skills__list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.skills__item {
  color: var(--color_text_muted);
  font-size: 1rem;
  position: relative;
  padding-left: 1rem;
}

.skills__item::before {
  content: '';
  border-radius: 50%;
  background-color: var(--color_accent);
  position: absolute;
  left: 0;
  top: 10px;
  width: 5px;
  height: 5px;
}

.skills__item strong {
  color: var(--color_text_main);
  font-weight: bold;
}

@media (max-width: 992px) {
  .skills__contents {
    gap: 1rem;
  }

  .skills__box {
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 768px) {
  .skills__contents {
    grid-template-columns: 1fr;
  }
}



.scope-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.scope-columns__title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.scope-columns__title::before {
  content: '✓';
  color: var(--color_sub);
  font-weight: bold;
}

.scope-columns__desc {
  color: var(--color_base-light);
  font-size: 0.875rem;
}

@media (max-width: 992px) {
  .scope-columns {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WorkDetailView from '../views/WorkDetailView.vue'
// createWebHistory:ブラウザの履歴機能（HTML5 History API）を使ったルーティング方式

const routes = [
  {
    path: '/',
    name: 'Home',// top
    component: HomeView,
  },
  {
    path: '/works/:id',
    name: 'WorkDetail', // 実績詳細
    component: WorkDetailView,
    props: true, // URLパラメータをpropsとして受け取る設定
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,

  // ページ遷移時にスクロール位置を最上部へ戻す
  // scrollBehavior() {
  //   return { top: 0 }
  // },
  scrollBehavior(to, from, savedPosition) {
    // ブラウザの「戻る / 進む」ボタン時は前回の閲覧位置を復元
    if (savedPosition) {
      return savedPosition
    }

    // ハッシュ付きリンク（例: /#works や /#skills）への遷移時
    if (to.hash) {
      return new Promise((resolve) => {
        // 遷移先ページのDOMが生成されるタイミングに合わせてわずかに待機
        setTimeout(() => {
          const targetEl = document.querySelector(to.hash)
          if (!targetEl) {
            resolve({ top: 0 })
            return
          }

          // 固定ヘッダーの現在の高さを動的取得（PC/SP可変対応）
          const header = document.querySelector('.site-header')
          const headerHeight = header ? header.offsetHeight : 0

          resolve({
            el: to.hash,
            top: headerHeight, // 要素の上端からヘッダーの高さ分だけ下に留める
            behavior: 'smooth',
          })
        }, 120) // 120ms待機して確実にDOM要素を捕捉
      })
    }

    // 通常のページ遷移時は最上部へスクロール
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
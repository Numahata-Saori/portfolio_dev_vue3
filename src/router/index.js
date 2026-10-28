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
  history: createWebHistory(),
  routes,
  // ページ遷移時にスクロール位置を最上部へ戻す
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
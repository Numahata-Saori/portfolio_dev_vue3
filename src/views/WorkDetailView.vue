<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const workId = route.params.id

const work = ref(null) // APIから取得したデータの配列を保持
const loading = ref(true) // 通信中かどうかを判定
const errorMsg = ref(null) // 通信失敗時のエラー分を保持

// WordPress REST API連携
// 初期表示された直後1回だけ自動実行
onMounted(async () => {
  try {
    // サーバーからID指定で単一のJSONデータ取得
    const res = await fetch(`https://dev.shaorim.com/wp-json/wp/v2/works/${workId}?_embed`)
    if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`)
    const data = await res.json()
    work.value = data
  } catch (err) {
    errorMsg.value = `詳細データの取得に失敗しました: ${err.message}`
  } finally {
    loading.value = false // 読み込み中を解除
  }
})
</script>

<template>
  <div class="detail-view">
    <RouterLink to="/" class="back-link">← 実績一覧に戻る</RouterLink>

    <div v-if="loading" class="state-text">詳細を読み込み中...</div>
    <div v-else-if="errorMsg" class="state-text error">{{ errorMsg }}</div>

    <article v-else-if="work" class="detail-article">
      <!-- タイトル -->
      <h1 class="detail-title">{{ work.title.rendered }}</h1>

      <!-- ACF情報 -->
      <div v-if="work.acf?.works_stack" class="meta-box">
        <strong>使用技術：</strong> {{ work.acf.works_stack }}
      </div>

      <!-- メイン画像 -->
      <div
        v-if="work._embedded?.['wp:featuredmedia']?.[0]?.source_url"
        class="main-image-wrap"
      >
        <img
          :src="work._embedded['wp:featuredmedia'][0].source_url"
          :alt="work.title.rendered"
          class="main-image"
        />
      </div>

      <!-- 投稿本文（HTML） -->
      <div class="content" v-html="work.content.rendered"></div>
    </article>
  </div>
</template>

<style scoped>
.detail-view {
  max-width: 800px;
  margin: 0 auto;
}
.back-link {
  display: inline-block;
  margin-bottom: 24px;
  color: #0066cc;
  text-decoration: none;
  font-weight: bold;
}
.back-link:hover {
  text-decoration: underline;
}
.detail-title {
  font-size: 2rem;
  margin-bottom: 16px;
}
.meta-box {
  background: #f8f9fa;
  border-left: 4px solid #00aa6e;
  padding: 12px 16px;
  margin-bottom: 24px;
  font-size: 0.95rem;
}
.main-image-wrap {
  margin-bottom: 32px;
  border-radius: 8px;
  overflow: hidden;
  max-height: 450px;
  background: #eee;
}
.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.content {
  line-height: 1.8;
  font-size: 1rem;
  color: #333;
}
.state-text {
  text-align: center;
  padding: 40px 0;
  font-size: 1.1rem;
}
.state-text.error {
  color: #e53935;
}
</style>
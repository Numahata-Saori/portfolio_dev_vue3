<script setup>
import { ref, onMounted } from 'vue'

// 取得した実績データを入れるリアクティブ変数
const works = ref([])
const loading = ref(true)
const errorMsg = ref(null)

// コンポーネント表示時にAPIを叩く
onMounted(async () => {
  try {
    const res = await fetch('https://dev.shaorim.com/wp-json/wp/v2/works?_embed')
    if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`)

    const data = await res.json()
    works.value = data
  } catch (err) {
    errorMsg.value = `データの取得に失敗しました: ${err.message}`
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="container">
    <header class="header">
      <h1>Portfolio Works (API連携テスト)</h1>
      <p class="status">エックスサーバー WP REST API 疎通中</p>
    </header>

    <!-- ローディング中 -->
    <div v-if="loading" class="state-text">データを読み込み中...</div>

    <!-- エラー時 -->
    <div v-else-if="errorMsg" class="state-text error">{{ errorMsg }}</div>

    <!-- 取得成功：実績カード一覧 -->
    <div v-else class="works-grid">
      <article v-for="item in works" :key="item.id" class="work-card">
        <!-- アイキャッチ画像（_embed経由で取得） -->
        <div class="thumb-wrap">
          <img
            v-if="item._embedded?.['wp:featuredmedia']?.[0]?.source_url"
            :src="item._embedded['wp:featuredmedia'][0].source_url"
            :alt="item.title.rendered"
            class="thumb"
          />
          <div v-else class="thumb no-image">No Image</div>
        </div>

        <div class="card-body">
          <!-- 投稿タイトル -->
          <h2 class="card-title">{{ item.title.rendered }}</h2>

          <!-- ACF：技術スタック -->
          <p v-if="item.acf?.works_stack" class="card-stack">
            <strong>技術：</strong>{{ item.acf.works_stack }}
          </p>

          <!-- 投稿本文（HTMLエンティティ含む） -->
          <div class="card-excerpt" v-html="item.content.rendered"></div>
        </div>
      </article>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: sans-serif;
  color: #333;
}

.header {
  margin-bottom: 40px;
  border-bottom: 2px solid #eee;
  padding-bottom: 20px;
}

.status {
  color: #00aa6e;
  font-weight: bold;
}

.state-text {
  font-size: 1.2rem;
  padding: 40px 0;
  text-align: center;
}

.state-text.error {
  color: #e53935;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.work-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.thumb-wrap {
  width: 100%;
  height: 180px;
  background: #f5f5f5;
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.card-body {
  padding: 16px;
}

.card-title {
  font-size: 1.2rem;
  margin: 0 0 8px;
}

.card-stack {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 12px;
}

.card-excerpt {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.6;
}
</style>

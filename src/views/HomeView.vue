<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const works = ref([]) // APIから取得したデータの配列を保持
const loading = ref(true) // 通信中かどうかを判定
const errorMsg = ref(null) // 通信失敗時のエラー分を保持

// WordPress REST API連携
// 初期表示された直後1回だけ自動実行
onMounted(async () => {
  try {
    // サーバーからJSONデータ取得
    const res = await fetch('https://dev.shaorim.com/wp-json/wp/v2/works?_embed') // ?_embedWPは WP REST APIのパラメータ
    if (!res.ok) throw new Error(`HTTPエラー: ${res.status}`)
    const data = await res.json()
    works.value = data
  } catch (err) {
    errorMsg.value = `データの取得に失敗しました: ${err.message}`
  } finally {
    loading.value = false // 読み込み中を解除
  }
})
</script>

<template>
  <div class="home-view">
    <div v-if="loading" class="state-text">実績データを読み込み中...</div>
    <div v-else-if="errorMsg" class="state-text error">{{ errorMsg }}</div>

    <div v-else class="works-grid">
      <article v-for="item in works" :key="item.id" class="work-card">
        <!-- 詳細ページへのリンク -->
        <RouterLink :to="`/works/${item.id}`" class="card-link">
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
            <h2 class="card-title">{{ item.title.rendered }}</h2>
            <p v-if="item.acf?.works_stack" class="card-stack">
              <strong>技術：</strong>{{ item.acf.works_stack }}
            </p>
          </div>
        </RouterLink>
      </article>
    </div>
  </div>
</template>

<style scoped>
.state-text {
  font-size: 1.1rem;
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.work-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
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
  font-size: 1.15rem;
  margin: 0 0 8px;
}
.card-stack {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}
</style>
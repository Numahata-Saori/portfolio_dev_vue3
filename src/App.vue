<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <header class="site-header">
      <div class="header-inner">
        <RouterLink to="/" class="site-logo">Portfolio</RouterLink>
        <nav class="site-nav">
          <RouterLink to="/">Works</RouterLink>
        </nav>
      </div>
    </header>

    <!-- ここに HomeView や WorkDetailView が動的に切り替わって表示される -->
    <main class="site-main">
      <RouterView />
    </main>

    <footer class="site-footer">
      <p>&copy; 2026 Creative Swamp. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  color: #333;
}
.site-header {
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.site-logo {
  font-size: 1.25rem;
  font-weight: bold;
  text-decoration: none;
  color: #222;
}
.site-nav a {
  text-decoration: none;
  color: #555;
  font-weight: 500;
}
.site-main {
  flex: 1;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px;
  box-sizing: border-box;
}
.site-footer {
  border-top: 1px solid #eee;
  text-align: center;
  padding: 24px;
  font-size: 0.85rem;
  color: #888;
}
</style>

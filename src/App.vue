<script setup>
import { RouterView, RouterLink } from 'vue-router'
import ThreeBackground from './components/ThreeBackground.vue'
</script>

<template>
  <div class="app-layout">
    <ThreeBackground />

    <header class="site-header">
      <div class="header-inner">
        <RouterLink to="/" class="site-logo">Portfolio</RouterLink>
        <nav class="site-nav">
          <RouterLink to="/">Works</RouterLink>
        </nav>
      </div>
    </header>

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
  /* color: #333; */
  color: #2c3e50;
  /* background: #f8fafc; */
  background: rgba(248, 250, 252, 0.8);
}
.site-header {
  /* border-bottom: 1px solid #e5e5e5; */
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  /* background: #fff; */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
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
  /* color: #222; */
  color: #0f172a;
}
.site-nav a {
  text-decoration: none;
  /* color: #555; */
  color: #475569;
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
  /* border-top: 1px solid #eee; */
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  text-align: center;
  padding: 24px;
  font-size: 0.85rem;
  /* color: #888; */
  color: #64748b;
}
</style>

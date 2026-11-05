<script setup>
import { RouterView, RouterLink } from 'vue-router'
import ThreeBackground from './components/ThreeBackground.vue'
</script>

<template>
  <div class="app-layout">
    <ThreeBackground />

    <header class="site-header js_header_hight">
      <div class="header-inner">
        <RouterLink to="/" class="site-logo">Portfolio</RouterLink>
        <nav class="site-nav">
          <RouterLink to="/#works" class="site-nav__link">Works</RouterLink>
          <RouterLink to="/#skills" class="site-nav__link">Skills</RouterLink>
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
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  /* font-family: sans-serif; */
  font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
  color: var(--color_text_main);
  background: radial-gradient(ellipse at 50% 15%, #0f1d38 0%, #070c18 60%, #04070f 100%);
  background-attachment: fixed;
}

.site-header {
  /* border-bottom: 1px solid rgba(226, 232, 240, 0.8); */
  /* background: rgba(255, 255, 255, 0.8); */
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(7, 12, 24, 0.7);
  backdrop-filter: blur(12px);
  /* position: sticky; */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  /* z-index: 10; */
  z-index: 100;
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
  /* font-size: 1.25rem; */
  font-size: 1.15rem;
  /* font-weight: bold; */
  font-weight: 700;
  text-decoration: none;
  color: var(--color_text_main);
  transition: color 0.3s ease;
}
.site-logo:hover {
  color: var(--color_accent);
}
.site-nav {
  display: flex;
  gap: 24px;
}
.site-nav__link {
  text-decoration: none;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}
.site-nav__link:hover {
  color: var(--color_text_main);
}

.site-main {
  flex: 1;
  /* max-width: 1000px; */
  width: 100%;
  /* margin: 0 auto; */
  /* padding: 40px 20px; */
  box-sizing: border-box;
}

.site-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(4, 7, 15, 0.8);
  backdrop-filter: blur(8px);
  color: #64748b;
  font-size: 0.85rem;
  text-align: center;
  padding: 32px 20px;
}
</style>

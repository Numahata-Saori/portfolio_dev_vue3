<script setup>
import { RouterView, RouterLink } from 'vue-router'
import ThreeBackground from './components/ThreeBackground.vue'
</script>

<template>
  <div class="app-layout">
    <ThreeBackground />

    <header class="site-header js-header-hight">
      <div class="header-inner">
        <RouterLink to="/" class="site-logo">Creative Swamp</RouterLink>
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
  background: radial-gradient(ellipse at 50% 15%, #0f1d38 0%, #070c18 60%, #04070f 100%);
  background-attachment: fixed;

  display: flex;
  flex-direction: column;
  position: relative;
}

.site-header {
  border-bottom: 1px solid var(--color-surface-contents);
  background: rgba(7, 12, 24, 0.7);
  backdrop-filter: blur(12px);

  transition: border-color 0.9s ease;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
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
  font-size: 1.15rem;
  font-weight: bold;
  text-decoration: none;
  color: var(--color-text-main);
  transition: color 0.3s ease;
}

.site-logo:hover {
  color: var(--color-accent);
}

.site-nav {
  display: flex;
  gap: 24px;
}

.site-nav__link {
  text-decoration: none;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}

.site-nav__link:hover {
  color: var(--color-text-main);
}

.site-main {
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

.site-footer {
  border-top: 1px solid var(--color-surface-contents);
  background: rgba(4, 7, 15, 0.8);
  backdrop-filter: blur(8px);
  color: var(--color-text-muted);
  font-size: 0.85rem;
  text-align: center;
  padding: 32px 20px;
  position: relative;
  z-index: 2;
}
</style>

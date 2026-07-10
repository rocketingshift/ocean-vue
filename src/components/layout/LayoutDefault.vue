<!-- src/components/layout/LayoutDefault.vue -->
<template>
  <div class="layout-default">
    <!-- Preloader overlay -->
    <Preloader />

    <!-- Introduction screen -->
    <Introduction />

    <!-- Main content (router-view) -->
    <RouterView />

    <!-- Header nav — chỉ hiện sau intro -->
    <header v-if="appStore.isIntroduced" class="site-header no-select">
      <div class="site-header__logo">OCEANX</div>
      <div class="site-header__right">
        <button class="btn-menu" @click="toggleMenu">
          MENU
          <span class="btn-menu__icon">
            <span /><span /><span />
          </span>
        </button>
      </div>
    </header>

    <!-- Chapter menu overlay -->
    <Transition name="menu-fade">
      <div v-if="menuOpen" class="chapter-menu" @click.self="toggleMenu">
        <nav class="chapter-menu__nav">
          <button
            v-for="(ch, i) in chapters"
            :key="i"
            class="chapter-menu__item"
            @click="goToChapter(ch)"
          >
            {{ ch.title }}
          </button>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Preloader from '@/components/sections/Preloader.vue'
import Introduction from '@/components/sections/Introduction.vue'
import { useAppStore } from '@/stores/useAppStore'
import { useScrollStore } from '@/stores/useScrollStore'
import { CHAPTERS } from '@/data/chapters'

const appStore    = useAppStore()
const scrollStore = useScrollStore()

const menuOpen = ref(false)
const chapters = CHAPTERS

function toggleMenu () {
  menuOpen.value = !menuOpen.value
}

function goToChapter (ch) {
  menuOpen.value = false
  // Scroll đến vị trí tương ứng với chapter progress
  const totalHeight = scrollStore.totalScrollHeight
  const target = ch.progress * totalHeight
  window.scrollTo({ top: target, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.layout-default {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

/* Header — NO dotted border, clean */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  /* KHÔNG có border-bottom — đây là fix dotted line */
  pointer-events: none;

  &__logo {
    font-family: var(--font-display, sans-serif);
    font-size: 14px;
    letter-spacing: 0.15em;
    color: var(--color-accent, #7dd3fc);
    pointer-events: auto;
  }

  &__right {
    pointer-events: auto;
  }
}

.btn-menu {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border: 1px solid var(--color-accent, #7dd3fc);
  background: rgba(0, 20, 50, 0.6);
  color: var(--color-accent, #7dd3fc);
  font-size: 12px;
  letter-spacing: 0.12em;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: background 0.2s;

  &:hover {
    background: rgba(125, 211, 252, 0.15);
  }

  &__icon {
    display: flex;
    flex-direction: column;
    gap: 3px;

    span {
      display: block;
      width: 16px;
      height: 1.5px;
      background: var(--color-accent, #7dd3fc);
    }
  }
}

/* Chapter menu overlay */
.chapter-menu {
  position: fixed;
  inset: 0;
  z-index: 15;
  background: rgba(0, 10, 30, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  &__item {
    background: none;
    border: none;
    color: #fff;
    font-size: 20px;
    letter-spacing: 0.08em;
    cursor: pointer;
    padding: 8px 24px;
    transition: color 0.2s, letter-spacing 0.2s;

    &:hover {
      color: var(--color-accent, #7dd3fc);
      letter-spacing: 0.16em;
    }
  }
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.35s ease;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="chapter-drawer-frame">

    <!-- Chapter list (drawer) -->
    <div class="chapter-list" :class="{ '--open': isOpen }">
      <button class="chapter-list__toggle" @click="isOpen = !isOpen">
        <span>{{ currentChapter?.label ?? 'Menu' }}</span>
        <span class="toggle-icon">{{ isOpen ? '✕' : '≡' }}</span>
      </button>

      <ul class="chapter-list__items" v-if="isOpen">
        <li
          v-for="ch in navigableChapters"
          :key="ch.id"
          class="chapter-list__item"
          :class="{ '--active': ch.id === scrollStore.currentChapter }"
          @click="navigateTo(ch)"
        >
          <span class="item-dot" />
          <span class="item-label">{{ ch.label }}</span>
        </li>
      </ul>
    </div>

    <!-- Chapter section overlay -->
    <ChapterSection />

  </div>
</template>

<script setup>
import { ref, computed }    from 'vue'
import { useScrollStore }   from '@/stores/useScrollStore'
import { CHAPTERS }         from '@/data/chapters'
import ChapterSection       from './ChapterSection.vue'

const scrollStore = useScrollStore()
const isOpen      = ref(false)

const navigableChapters = computed(() =>
  CHAPTERS.filter(ch => ch.label !== null)
)

const currentChapter = computed(() =>
  CHAPTERS.find(ch => ch.id === scrollStore.currentChapter)
)

function navigateTo(ch) {
  const targetY = ch.scrollStart * scrollStore.totalScrollHeight
  scrollStore.scrollTo(targetY)
  isOpen.value = false
}
</script>

<style scoped>
.chapter-drawer-frame {
  height: 100%;
  pointer-events: none;
  position: relative;
  width: 100%;
}

.chapter-list {
  bottom: var(--spacing);
  pointer-events: all;
  position: absolute;
  right: var(--spacing);
  z-index: var(--z-overlay);
}

.chapter-list__toggle {
  align-items: center;
  background: rgba(0, 13, 21, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(144, 224, 239, 0.2);
  color: var(--color-primary);
  cursor: pointer;
  display: flex;
  font-size: 1.1rem;
  gap: 1rem;
  letter-spacing: 0.1em;
  padding: 0.8rem 1.4rem;
  text-transform: uppercase;
}

.toggle-icon { font-size: 1.4rem; }

.chapter-list__items {
  background: rgba(0, 13, 21, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(144, 224, 239, 0.1);
  list-style: none;
  margin-top: 0.4rem;
  padding: 0.8rem 0;
}

.chapter-list__item {
  align-items: center;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  font-size: 1.1rem;
  gap: 0.8rem;
  letter-spacing: 0.12em;
  padding: 0.7rem 1.4rem;
  text-transform: uppercase;
  transition: color var(--transition-fast);
}
.chapter-list__item:hover,
.chapter-list__item.--active {
  color: var(--color-primary);
}

.item-dot {
  background: currentColor;
  border-radius: 50%;
  flex-shrink: 0;
  height: 5px;
  width: 5px;
}
</style>

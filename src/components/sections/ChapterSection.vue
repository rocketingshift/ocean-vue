<template>
  <div class="chapter-section-container">
    <transition name="chapter-fade" mode="out-in">
      <div
        v-if="activeChapter?.label"
        :key="activeChapter.id"
        class="chapter-section"
        ref="sectionRef"
      >
        <div class="chapter-section__inner">

          <!-- Chapter number -->
          <p class="chapter-number">
            {{ String(activeChapter.id).padStart(2, '0') }}
            <span class="chapter-number__sep">—</span>
            {{ CHAPTERS.filter(c=>c.label).length - 1 }}
          </p>

          <!-- Chapter label -->
          <h2 class="chapter-title" ref="titleRef">
            <span
              v-for="(char, i) in activeChapter.label.split('')"
              :key="i"
              class="--char"
            >{{ char === ' ' ? '\u00A0' : char }}</span>
          </h2>

          <!-- Progress indicator -->
          <div class="chapter-progress">
            <div
              class="chapter-progress__fill"
              :style="{ width: `${chapterLocalProgress * 100}%` }"
            />
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { gsap }                 from 'gsap'
import { useScrollStore }       from '@/stores/useScrollStore'
import { CHAPTERS }             from '@/data/chapters'

const scrollStore = useScrollStore()
const sectionRef  = ref(null)
const titleRef    = ref(null)

const activeChapter = computed(() =>
  CHAPTERS.find(ch => ch.id === scrollStore.currentChapter)
)

// Progress dentro del capítulo actual (0→1)
const chapterLocalProgress = computed(() => {
  const ch = activeChapter.value
  if (!ch) return 0
  const range = ch.scrollEnd - ch.scrollStart
  if (range <= 0) return 0
  return Math.min(1, Math.max(0,
    (scrollStore.scrollProgress - ch.scrollStart) / range
  ))
})

// Animate chars on chapter change
watch(activeChapter, () => {
  if (!titleRef.value) return
  const chars = titleRef.value.querySelectorAll('.--char')
  gsap.fromTo(chars,
    { yPercent: 100, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.025, ease: 'power3.out', delay: 0.1 },
  )
})
</script>

<style scoped>
.chapter-section-container {
  bottom: 10rem;
  left: var(--spacing);
  pointer-events: none;
  position: absolute;
  z-index: var(--z-content);
}

.chapter-section__inner {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.chapter-number {
  color: var(--color-primary);
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  opacity: 0.7;
}
.chapter-number__sep { margin: 0 0.4rem; }

.chapter-title {
  color: var(--color-white);
  font-size: clamp(2.4rem, 5vw, 4.8rem);
  font-weight: 300;
  line-height: 1.1;
  overflow: hidden;
}
.--char { display: inline-block; will-change: transform; }

.chapter-progress {
  background: rgba(255,255,255,0.1);
  height: 1px;
  margin-top: 0.8rem;
  overflow: hidden;
  width: 12rem;
}
.chapter-progress__fill {
  background: var(--color-primary);
  height: 100%;
  transform-origin: left;
  transition: width 0.15s linear;
}

/* Transition */
.chapter-fade-enter-active,
.chapter-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.chapter-fade-enter-from   { opacity: 0; transform: translateY(10px); }
.chapter-fade-leave-to     { opacity: 0; transform: translateY(-10px); }
</style>

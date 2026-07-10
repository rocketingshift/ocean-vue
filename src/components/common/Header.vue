<template>
  <header class="header" :data-v-id="'header'">
    <div class="header-content">
      <!-- Logo / brand -->
      <div class="header-logo">
        <span class="header-logo__text">OceanX</span>
      </div>

      <!-- Chapter indicator -->
      <nav class="header-nav" v-if="appStore.isIntroduced">
        <span class="header-nav__label">
          {{ currentChapterLabel }}
        </span>
      </nav>

      <!-- Audio toggle -->
      <button
        v-if="appStore.isIntroduced"
        class="header-audio"
        @click="emit('toggleAudio')"
        :aria-label="isMuted ? 'Unmute' : 'Mute'"
      >
        <span class="header-audio__icon">{{ isMuted ? '🔇' : '🔊' }}</span>
      </button>
    </div>

    <!-- Dashed progress line -->
    <div class="line" :class="{ '--visible': appStore.isIntroduced }">
      <div class="fill" :style="{ '--progress': scrollStore.scrollProgress }" />
    </div>
  </header>
</template>

<script setup>
import { computed }      from 'vue'
import { useAppStore }   from '@/stores/useAppStore'
import { useScrollStore } from '@/stores/useScrollStore'
import { CHAPTERS }      from '@/data/chapters'

const emit       = defineEmits(['toggleAudio'])
const props      = defineProps({ isMuted: Boolean })

const appStore    = useAppStore()
const scrollStore = useScrollStore()

const currentChapterLabel = computed(() => {
  const ch = CHAPTERS.find(c => c.id === scrollStore.currentChapter)
  return ch?.label ?? ''
})
</script>

<style scoped>
.header {
  height: var(--header-height);
  left: 0;
  padding: 0 var(--spacing-sm);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: var(--z-header);
}

.header-content {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: space-between;
}

.header-logo__text {
  color: var(--color-primary);
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.header-nav__label {
  color: var(--color-white);
  font-size: 1.2rem;
  letter-spacing: 0.15em;
  opacity: 0.7;
  text-transform: uppercase;
}

.header-audio {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.8rem;
}

/* Dashed border line */
.line {
  border-bottom: 1px solid transparent;
  border-image: repeating-linear-gradient(
    90deg,
    var(--color-gray) 0, var(--color-gray) 2px,
    transparent 0, transparent 6px
  ) 1;
  bottom: 0;
  clip-path: inset(0 100% 0 0);
  left: 0;
  position: absolute;
  transition: clip-path 1.4s var(--ease-standard);
  width: 100%;
}
.line.--visible { clip-path: inset(0 0 0 0); }

/* Progress fill */
.fill {
  background-color: var(--color-primary);
  bottom: -1px;
  height: 1px;
  left: 0;
  position: relative;
  transform: scaleX(var(--progress, 0));
  transform-origin: left;
  width: 100%;
  transition: transform 0.1s linear;
}

@media (min-width: 1024px) {
  .header { padding: 0 var(--spacing-md); }
}
</style>

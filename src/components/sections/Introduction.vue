<template>
  <div
    class="introduction no-select"
    ref="introRef"
    :class="{ '--visible': isVisible }"
  >
    <div class="main-content">

      <!-- Label -->
      <div class="label-wrapper">
        <div class="label" ref="labelRef">
          <span class="square" />
          &nbsp; OceanX 2025
        </div>
      </div>

      <!-- Title -->
      <h1 class="title" ref="titleRef">
        <span
          v-for="(char, i) in titleChars"
          :key="i"
          class="--char"
          :style="{ display: char === ' ' ? 'inline' : 'inline-block' }"
          v-html="char === ' ' ? '&nbsp;' : char"
        />
      </h1>

      <!-- CTA Button -->
      <button class="button" ref="btnRef" @click="onStart">
        Explore the Year
      </button>

    </div>

    <!-- Bottom links -->
    <div class="introduction-links" ref="linksRef">
      <a href="https://oceanx.org" target="_blank" rel="noopener">oceanx.org</a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { gsap }          from 'gsap'
import { useWebGLStore } from '@/stores/useWebGLStore'
import { useAppStore }   from '@/stores/useAppStore'
import { useAudio }      from '@/composables/useAudio'

const webglStore = useWebGLStore()
const appStore   = useAppStore()
const { play }   = useAudio()

const introRef  = ref(null)
const labelRef  = ref(null)
const titleRef  = ref(null)
const btnRef    = ref(null)
const linksRef  = ref(null)
const isVisible = ref(false)

const TITLE = 'Year in Review'
const titleChars = computed(() => TITLE.split(''))

// Show intro when WebGL is ready
watch(() => webglStore.isReady, (ready) => {
  if (!ready) return
  setTimeout(() => animateIn(), 400)
})

function animateIn() {
  isVisible.value = true
  const tl = gsap.timeline()

  tl.fromTo(labelRef.value,
    { y: '100%', opacity: 0 },
    { y: '0%', opacity: 1, duration: 0.6, ease: 'power3.out' },
  )
  .fromTo(
    titleRef.value.querySelectorAll('.--char'),
    { yPercent: 110, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: 'power3.out' },
    '-=0.3',
  )
  .fromTo(btnRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
    '-=0.2',
  )
  .fromTo(linksRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.4 },
    '-=0.2',
  )
}

function onStart() {
  play()
  const tl = gsap.timeline({
    onComplete: () => appStore.setIntroduced(true),
  })
  tl.to(introRef.value, {
    opacity: 0,
    y: -30,
    duration: 0.8,
    ease: 'power2.in',
  })
}
</script>

<style scoped>
.introduction {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100svh;
  height: calc(var(--svh, 1svh) * 100);
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  visibility: hidden;
  width: 100%;
  z-index: var(--z-content);
}
.introduction.--visible { visibility: visible; }

.main-content {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 6.4rem;
  text-align: center;
}

.label-wrapper { overflow: clip; }

.label {
  align-items: center;
  color: var(--color-primary);
  display: flex;
  font-size: 1.2rem;
  justify-content: center;
  letter-spacing: 0.15em;
  margin-bottom: 1.6rem;
  text-transform: uppercase;
}

.label .square {
  background-color: var(--color-primary);
  display: inline-block;
  height: 8px;
  width: 8px;
  margin-right: 0.8rem;
}

.title {
  color: var(--color-white);
  font-size: clamp(3.2rem, 8vw, 7.2rem);
  font-weight: 300;
  line-height: 1.1;
  margin-bottom: 3.4rem;
  overflow: hidden;
}

.--char { will-change: transform; }

.button {
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  cursor: pointer;
  font-size: 1.2rem;
  letter-spacing: 0.2em;
  padding: 1.2rem 3.2rem;
  text-transform: uppercase;
  transition: background var(--transition-fast), color var(--transition-fast);
}
.button:hover {
  background: var(--color-primary);
  color: var(--color-bg);
}

.introduction-links {
  bottom: var(--spacing);
  color: rgba(255,255,255,0.4);
  font-size: 1.1rem;
  left: var(--spacing);
  position: absolute;
}
.introduction-links a {
  color: inherit;
  text-decoration: none;
}
.introduction-links a:hover { color: var(--color-primary); }
</style>

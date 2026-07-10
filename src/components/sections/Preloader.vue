<template>
  <Teleport to="body">
    <div
      v-if="!isDone"
      class="preloader"
      ref="preloaderRef"
      :class="{ '--fading': isFading }"
    >
      <div class="wrapper" ref="wrapperRef">

        <!-- Outer spinning ring -->
        <div class="circle-outer" ref="outerRef">
          <svg class="circle-svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48"
              fill="none"
              stroke="rgba(144,224,239,0.15)"
              stroke-width="0.5"
              stroke-dasharray="4 4"
            />
          </svg>
          <!-- Orbiting dot -->
          <div class="orbit-container">
            <div class="orbiting-dot" ref="dotRef" />
          </div>
        </div>

        <!-- Inner circle -->
        <div class="circle-inner" ref="innerRef" />

        <!-- Loading % -->
        <span class="loading" ref="loadingTextRef">
          {{ loadPercent }}%
        </span>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { gsap }           from 'gsap'
import { useWebGLStore }  from '@/stores/useWebGLStore'
import { useAppStore }    from '@/stores/useAppStore'

const webglStore = useWebGLStore()
const appStore   = useAppStore()

const isDone         = ref(false)
const isFading       = ref(false)   // CSS class fallback nếu GSAP lỗi
const preloaderRef   = ref(null)
const wrapperRef     = ref(null)
const outerRef       = ref(null)
const innerRef       = ref(null)
const dotRef         = ref(null)
const loadingTextRef = ref(null)

const loadPercent = computed(() => webglStore.loadPercent)

// ── Entry animations ──────────────────────────────────────────────────────────
onMounted(() => {
  if (wrapperRef.value) {
    gsap.to(wrapperRef.value, { opacity: 1, duration: 0.8, delay: 0.3 })
  }
  if (outerRef.value) {
    gsap.to(outerRef.value, {
      rotation: 360, duration: 8, ease: 'none', repeat: -1,
    })
  }
  if (innerRef.value) {
    gsap.to(innerRef.value, {
      rotationX: 20, rotationY: 15, duration: 2,
      ease: 'sine.inOut', yoyo: true, repeat: -1,
    })
  }
  if (dotRef.value) {
    gsap.set(dotRef.value, { visibility: 'visible' })
    gsap.to(dotRef.value, {
      rotation: 360, duration: 3, ease: 'none', repeat: -1,
      transformOrigin: '50% 155px',
    })
  }

  // ✅ FALLBACK CỨNG: sau 12s buộc dismiss dù WebGL chưa ready
  setTimeout(() => {
    if (!isDone.value) {
      console.warn('[Preloader] ⏱ Hard timeout 12s — force dismiss')
      _dismiss()
    }
  }, 12000)
})

// ── Watch WebGL ready → dismiss ───────────────────────────────────────────────
// immediate:true để bắt trường hợp isReady đã true trước khi watch setup
watch(() => webglStore.isReady, (ready) => {
  if (!ready) return
  _dismiss()
}, { immediate: true })

// ── Dismiss logic — 3 lớp fallback ───────────────────────────────────────────
function _dismiss() {
  if (isDone.value) return  // guard: chỉ chạy 1 lần

  if (preloaderRef.value) {
    // Lớp 1: GSAP animation
    try {
      gsap.to(preloaderRef.value, {
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        onComplete:  () => { isDone.value = true },
        onInterrupt: () => { isDone.value = true },
      })
    } catch (e) {
      // Lớp 2: CSS class transition
      console.warn('[Preloader] GSAP fail → CSS fallback:', e?.message)
      _cssFallback()
    }
  } else {
    // Lớp 3: instant dismiss (ref null vì Teleport edge case)
    console.warn('[Preloader] preloaderRef null → instant dismiss')
    isDone.value = true
  }
}

function _cssFallback() {
  isFading.value = true
  setTimeout(() => { isDone.value = true }, 1000)
}
</script>

<style scoped>
.preloader {
  align-items: center;
  background-color: var(--color-bg);
  display: flex;
  height: 100svh;
  height: calc(var(--svh, 1svh) * 100);
  inset: 0;
  justify-content: center;
  position: fixed;
  width: 100%;
  z-index: var(--z-preloader);
  /* CSS fallback transition */
  transition: opacity 0.8s ease;
}

/* CSS class fallback khi GSAP fail */
.preloader.--fading {
  opacity: 0;
  pointer-events: none;
}

.wrapper {
  align-items: center;
  display: flex;
  justify-content: center;
  opacity: 0;
  perspective: 50cm;
  position: relative;
}

.circle-outer {
  height: 31rem;
  position: absolute;
  transform-origin: center center;
  transform-style: preserve-3d;
  width: 31rem;
  will-change: transform;
}

.circle-svg { height: 100%; width: 100%; }

.orbit-container {
  border-radius: 50%;
  height: 100%;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
}

.orbiting-dot {
  background-color: var(--color-primary);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  height: 1.2rem;
  position: absolute;
  right: -0.6rem;
  top: 50%;
  transform: translateY(-50%);
  visibility: hidden;
  width: 1.2rem;
}

.circle-inner {
  border-radius: 100%;
  height: 27rem;
  transform-origin: center center;
  transform-style: preserve-3d;
  width: 27rem;
  will-change: transform;
  background: radial-gradient(
    circle at 35% 35%,
    rgba(144, 224, 239, 0.08),
    rgba(0, 13, 21, 0.4)
  );
  border: 1px solid rgba(144, 224, 239, 0.1);
}

.loading {
  color: var(--color-primary);
  font-size: 1.2rem;
  letter-spacing: 0.15em;
  position: absolute;
  transform: translateY(3.1rem);
  z-index: 2;
}
</style>

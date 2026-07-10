<template>
  <!-- Custom scroll container: 2500vh long -->
  <div
    ref="scrollerRef"
    class="scroller no-scrollbar"
    :class="{ 'scroller--debug': appStore.isDebug }"
  >
    <!-- Scroll length spacer -->
    <div
      class="scroller-length"
      :class="{ debug: appStore.isDebug }"
    />

    <!-- Sticky canvas zone -->
    <div class="page-index">

      <!-- WebGL Canvas (always visible) -->
      <WebGLCanvas />

      <!-- Chapter content (overlaid on canvas) -->
      <div
        class="chapter-sections"
        :class="{ hide: !appStore.isIntroduced }"
      >
        <ChapterDrawerFrame />
      </div>

      <!-- Mobile swipe hint -->
      <div class="swipper__container no-select">
        <div class="swipper__wrapper">
          <ChapterSwiperButton />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref }              from 'vue'
import { useAppStore }      from '@/stores/useAppStore'
import { useScroller }      from '@/composables/useScroller'
import WebGLCanvas          from '@/components/webgl/WebGLCanvas.vue'
import ChapterDrawerFrame   from '@/components/sections/ChapterDrawerFrame.vue'
import ChapterSwiperButton  from '@/components/common/ChapterSwiperButton.vue'

const appStore    = useAppStore()
const scrollerRef = ref(null)

useScroller(scrollerRef)
</script>

<style scoped>
.scroller {
  height: 100svh;
  height: calc(var(--svh, 1svh) * 100);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: none;
}

.scroller-length {
  height: 2500vh;
  height: calc(var(--vh, 1vh) * 2500);
  pointer-events: none;
}
.scroller-length.debug {
  height: 0;
}

.page-index {
  position: sticky;
  top: 0;
  height: 100svh;
  height: calc(var(--svh, 1svh) * 100);
  width: 100%;
  overflow: hidden;
}

.chapter-sections {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}
.chapter-sections.hide {
  opacity: 0;
  visibility: hidden;
}

.swipper__container {
  height: 100svh;
  height: calc(var(--svh, 1svh) * 100);
  margin-bottom: -100svh;
  margin-bottom: calc(var(--svh, 1svh) * -100);
  pointer-events: none;
  position: sticky;
  top: 0;
}

.swipper__wrapper {
  bottom: 7rem;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
}

@media (min-width: 1024px) {
  .swipper__wrapper { display: none; }
}
</style>

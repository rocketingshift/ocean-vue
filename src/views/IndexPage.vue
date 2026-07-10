<template>
  <!--
    Custom scroll container — height: 100svh, overflow-y: auto
    Sticky pattern: page-index TRƯỚC, scroller-length SAU
    → page-index hiển thị ở scroll=0, sticky giữ nó khi scroll xuống
  -->
  <div
    ref="scrollerRef"
    class="scroller no-scrollbar"
    :class="{ 'scroller--debug': appStore.isDebug }"
  >
    <!-- ① Sticky canvas zone — PHẢI đứng TRƯỚC để thấy ở scroll:0 -->
    <div class="page-index">

      <!-- WebGL Canvas (always rendered, always behind content) -->
      <WebGLCanvas />

      <!-- Chapter content (hiện sau khi intro kết thúc) -->
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

    <!-- ② Scroll spacer — SAU sticky zone, tạo 2500vh scroll space -->
    <div
      class="scroller-length"
      :class="{ debug: appStore.isDebug }"
    />

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
/* ── Scroll container ─────────────────────────────────── */
.scroller {
  height: 100svh;
  height: calc(var(--svh, 1svh) * 100);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: none;
}

/* ── Sticky viewport — dính khi scroll ────────────────── */
.page-index {
  position: sticky;
  top: 0;
  height: 100svh;
  height: calc(var(--svh, 1svh) * 100);
  width: 100%;
  overflow: hidden;
}

/* ── Scroll spacer — tạo không gian scroll 2500vh ─────── */
.scroller-length {
  height: 2500vh;
  height: calc(var(--vh, 1vh) * 2500);
  pointer-events: none;
}
.scroller-length.debug { height: 0; }

/* ── Chapter overlay ──────────────────────────────────── */
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

/* ── Mobile swipe hint ────────────────────────────────── */
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

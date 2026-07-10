<template>
  <div class="layout-default">
    <!-- Fixed header (always on top) -->
    <Header />

    <!-- Preloader (z-index above everything) -->
    <Preloader />

    <!-- Introduction screen -->
    <Introduction />

    <!-- Main page content (scroll + WebGL) -->
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Header       from '@/components/common/Header.vue'
import Preloader    from '@/components/sections/Preloader.vue'
import Introduction from '@/components/sections/Introduction.vue'
</script>

<style scoped>
.layout-default {
  overflow: clip;
  position: relative;
}
.main {
  min-height: 100svh;
  min-height: calc(var(--svh, 1svh) * 100);
  position: relative;
}
</style>

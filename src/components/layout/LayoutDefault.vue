<template>
  <div class="layout-default">
    <AppHeader />
    <Preloader />
    <Introduction />
    <slot />
  </div>
</template>

<script setup>
import AppHeader from '@/components/ui/AppHeader.vue'
import Preloader from '@/components/sections/Preloader.vue'
import Introduction from '@/components/sections/Introduction.vue'
</script>

<!-- ⚠️ NO lang="scss" — plain CSS only to avoid sass-embedded dependency -->
<style scoped>
.layout-default {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #00000f;
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
}
</style>

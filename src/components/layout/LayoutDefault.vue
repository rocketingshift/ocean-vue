<template>
  <div class="layout-default">
    <WebGLCanvas />
    <Header :isMuted="isMuted" @toggleAudio="toggleMute" />
    <Preloader />
    <Introduction />
    <slot />
  </div>
</template>

<script setup>
import Header       from '@/components/common/Header.vue'
import Preloader    from '@/components/sections/Preloader.vue'
import Introduction from '@/components/sections/Introduction.vue'
import WebGLCanvas  from '@/components/webgl/WebGLCanvas.vue'
import { useAudio } from '@/composables/useAudio'

const { isMuted, toggleMute } = useAudio()
</script>

<!-- NO lang="scss" -->
<style scoped>
.layout-default {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #000d15;
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
}
</style>

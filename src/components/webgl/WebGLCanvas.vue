<template>
  <canvas
    ref="canvasRef"
    class="webgl-canvas"
    aria-hidden="true"
  />
</template>

<script setup>
import { ref }         from 'vue'
import { useWebGL }    from '@/composables/useWebGL'

const canvasRef = ref(null)
useWebGL(canvasRef)
</script>

<style scoped>
.webgl-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: var(--z-canvas);
}
</style>

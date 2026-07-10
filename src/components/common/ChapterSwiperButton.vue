<template>
  <div class="swiper-btn" role="presentation">
    <div class="swiper-btn__icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="#90e0ef" stroke-width="1.2">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
    </div>
    <span class="swiper-btn__label">Scroll</span>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'

const el = ref(null)

onMounted(() => {
  gsap.to('.swiper-btn__icon', {
    y: 6,
    duration: 1,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
})
</script>

<style scoped>
.swiper-btn {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.swiper-btn__label {
  color: rgba(255,255,255,0.4);
  font-size: 1rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
</style>

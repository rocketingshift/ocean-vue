<template>
  <button class="share-button" @click="share" :title="label">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.5">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
    <span>{{ label }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  url:   { type: String, default: () => window.location.href },
  title: { type: String, default: 'OceanX 2025 Year in Review' },
})

const label = 'Share'

async function share() {
  if (navigator.share) {
    await navigator.share({ title: props.title, url: props.url }).catch(() => {})
  } else {
    await navigator.clipboard.writeText(props.url)
    // Could show toast here
  }
}
</script>

<style scoped>
.share-button {
  align-items: center;
  background: none;
  border: 1px solid rgba(144, 224, 239, 0.3);
  color: var(--color-primary);
  cursor: pointer;
  display: flex;
  font-size: 1.1rem;
  gap: 0.6rem;
  letter-spacing: 0.1em;
  padding: 0.8rem 1.2rem;
  text-transform: uppercase;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}
.share-button:hover {
  background: rgba(144, 224, 239, 0.08);
  border-color: var(--color-primary);
}
</style>

<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/useAppStore'

const appStore = useAppStore()

onMounted(() => {
  appStore.init()
})

onUnmounted(() => {
  appStore.destroy()
})
</script>

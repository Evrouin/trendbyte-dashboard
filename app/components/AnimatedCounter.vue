<template>
  <span>{{ displayed.toLocaleString() }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{ value: number; duration?: number }>()
const displayed = ref(props.value)

if (import.meta.client) {
  watch(
    () => props.value,
    (target) => {
      const start = displayed.value
      const diff = target - start
      const duration = props.duration || 800
      const startTime = performance.now()

      const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        displayed.value = Math.round(start + diff * progress)
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    },
    { immediate: true },
  )
}
</script>

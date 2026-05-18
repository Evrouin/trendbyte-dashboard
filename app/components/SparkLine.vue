<template>
  <svg :width="width" :height="height" class="inline-block align-middle">
    <polyline :points="points" fill="none" :stroke="color" stroke-width="1.5" />
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    values: number[]
    width?: number
    height?: number
    color?: string
  }>(),
  { width: 60, height: 20, color: '#58a6ff' },
)

const points = computed(() => {
  if (!props.values.length) return ''
  const max = Math.max(...props.values)
  const min = Math.min(...props.values)
  const range = max - min || 1
  return props.values
    .map((v, i) => {
      const x = (i / (props.values.length - 1)) * props.width
      const y = props.height - ((v - min) / range) * (props.height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')
})
</script>

<template>
  <span
    v-for="badge in badges"
    :key="badge.label"
    class="rounded-full px-2 py-0.5 text-[10px] font-semibold"
    :class="badge.class"
  >
    {{ badge.label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  sources?: string[]
  growthPct?: number
  lifecycle?: string
  isNew?: boolean
}>()

const badges = computed(() => {
  const b: { label: string; class: string }[] = []
  if (props.lifecycle === 'rising') b.push({ label: 'Rising', class: 'bg-success/20 text-success' })
  if (props.lifecycle === 'declining') b.push({ label: 'Declining', class: 'bg-red/20 text-red' })
  if (props.isNew) b.push({ label: 'New', class: 'bg-purple/20 text-purple' })
  if ((props.sources?.length || 0) >= 4)
    b.push({ label: 'Multi-source', class: 'bg-accent/20 text-accent' })
  return b
})
</script>

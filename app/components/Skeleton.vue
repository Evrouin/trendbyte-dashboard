<template>
  <div class="animate-pulse rounded-lg bg-white/5" :class="[h, w]" />
</template>

<script setup lang="ts">
defineProps<{ h?: string; w?: string }>()
</script>

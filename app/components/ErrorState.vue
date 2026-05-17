<template>
  <div class="glass-card p-6 text-center">
    <p class="text-warning font-semibold">{{ message }}</p>
    <button
      v-if="retry"
      class="bg-accent/20 text-accent hover:bg-accent/30 mt-3 rounded-lg px-4 py-2 text-sm font-medium transition"
      @click="$emit('retry')"
    >
      Try again
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
  retry?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

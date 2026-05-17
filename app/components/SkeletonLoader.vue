<template>
  <div class="animate-pulse space-y-4">
    <div v-if="variant === 'cards'" class="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div v-for="i in 4" :key="i" class="glass-card p-6">
        <div class="h-8 w-16 rounded bg-border/30 mb-2"></div>
        <div class="h-4 w-20 rounded bg-border/20"></div>
      </div>
    </div>

    <div v-else-if="variant === 'table'" class="glass-card overflow-hidden">
      <div class="border-b border-border px-5 py-3 flex gap-8">
        <div v-for="i in 5" :key="i" class="h-4 w-16 rounded bg-border/20"></div>
      </div>
      <div v-for="i in rows" :key="i" class="border-b border-border-subtle px-5 py-4 flex gap-8 last:border-0">
        <div class="h-4 w-6 rounded bg-border/20"></div>
        <div class="h-4 w-24 rounded bg-border/30"></div>
        <div class="h-4 w-14 rounded bg-border/20"></div>
        <div class="h-4 w-14 rounded bg-border/20"></div>
        <div class="h-4 w-20 rounded bg-border/20"></div>
      </div>
    </div>

    <div v-else-if="variant === 'chart'" class="glass-card p-6" style="height: 300px">
      <div class="h-4 w-32 rounded bg-border/20 mb-6"></div>
      <div class="flex items-end gap-2 h-48">
        <div v-for="i in 8" :key="i" class="flex-1 rounded-t bg-border/20" :style="{ height: `${30 + Math.random() * 60}%` }"></div>
      </div>
    </div>

    <div v-else-if="variant === 'grid'" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="glass-card p-5">
        <div class="h-5 w-24 rounded bg-border/30 mb-3"></div>
        <div class="h-4 w-full rounded bg-border/20 mb-2"></div>
        <div class="h-4 w-3/4 rounded bg-border/20"></div>
      </div>
    </div>

    <div v-else class="glass-card p-6">
      <div class="h-5 w-32 rounded bg-border/30 mb-4"></div>
      <div class="space-y-3">
        <div class="h-14 rounded-xl bg-border/20"></div>
        <div class="h-14 rounded-xl bg-border/20"></div>
        <div class="h-14 rounded-xl bg-border/20"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "cards" | "table" | "chart" | "grid" | "default"
    rows?: number
  }>(),
  { variant: "default", rows: 5 },
)
</script>

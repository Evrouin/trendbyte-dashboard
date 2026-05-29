<template>
  <div>
    <h1 class="mb-2 text-3xl font-extrabold">Predictions</h1>
    <p class="text-text-secondary mb-8">Technologies showing early signs of trending.</p>

    <ErrorState v-if="error" message="Failed to load predictions" :retry="true" @retry="refresh" />

    <div
      v-else-if="store.predictions.length"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <NuxtLink
        v-for="p in store.predictions"
        :key="p.name"
        :to="trendPath(p.name)"
        class="glass-card hover:border-accent/30 flex min-w-0 flex-col justify-between overflow-hidden p-5 transition"
      >
        <div>
          <div class="mb-3 flex items-center justify-between">
            <span class="text-lg font-bold"
              ><TechIcon :name="p.name" size="sm" /> {{ p.name }}</span
            >
            <span
              class="rounded-full px-2.5 py-0.5 text-xs font-bold"
              :class="confidenceColor(p.confidence)"
            >
              {{ (p.confidence * 100).toFixed(0) }}%
            </span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="signal in p.signals"
              :key="signal"
              class="border-border-subtle bg-surface-hover text-text-secondary rounded-md border px-2 py-0.5 text-xs"
            >
              {{ formatSignal(signal) }}
            </span>
          </div>
        </div>
        <div class="text-text-muted mt-4 flex items-center justify-between text-xs">
          <span>{{ new Date(p.predicted_at).toLocaleDateString() }}</span>
        </div>
      </NuxtLink>
    </div>

    <div v-else class="glass-card p-8 text-center">
      <p class="text-text-secondary">
        No predictions yet. Data accumulates after multiple pipeline runs.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Predictions — TrendByte' })
import { formatSignal } from '~/utils/formatSignal'
import { useTrendsStore } from '~/stores/trends'

const store = useTrendsStore()
const error = ref(false)

try {
  await store.fetchPredictions(20)
} catch {
  error.value = true
}

const refresh = async () => {
  error.value = false
  try {
    store.invalidate()
    await store.fetchPredictions(20)
  } catch {
    error.value = true
  }
}

const confidenceColor = (confidence: number) => {
  if (confidence >= 0.7) return 'bg-success/30 text-success'
  if (confidence >= 0.5) return 'bg-yellow/30 text-yellow'
  return 'bg-accent/20 text-accent'
}
</script>

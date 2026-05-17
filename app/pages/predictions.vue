<template>
  <div>
    <h1 class="mb-2 text-3xl font-extrabold">Predictions</h1>
    <p class="mb-8 text-text-secondary">Technologies showing early signs of trending.</p>

    <SkeletonLoader v-if="pending" />
    <ErrorState v-else-if="error" message="Failed to load predictions" :retry="true" @retry="refresh" />

    <div v-else-if="predictions?.predictions?.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="p in predictions.predictions"
        :key="p.name"
        class="glass-card p-5 flex flex-col justify-between"
      >
        <div>
          <div class="mb-3 flex items-center justify-between">
            <span class="text-lg font-bold">{{ p.name }}</span>
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
              class="rounded-md border border-border-subtle bg-surface-hover px-2 py-0.5 text-xs text-text-secondary"
            >
              {{ formatSignal(signal) }}
            </span>
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between text-xs text-text-muted">
          <span>{{ new Date(p.predicted_at).toLocaleDateString() }}</span>
          <a
            v-if="p.url"
            :href="p.url"
            target="_blank"
            class="text-accent hover:underline"
          >
            Source
          </a>
        </div>
      </div>
    </div>

    <div v-else class="glass-card p-8 text-center">
      <p class="text-text-secondary">No predictions yet. Data accumulates after multiple pipeline runs.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Predictions — TrendByte" })
import { formatSignal } from "~/utils/formatSignal"

const { fetchPredictions } = useApi()
const { data: predictions, pending, error, refresh } = await fetchPredictions({ limit: 20 })

const confidenceColor = (confidence: number) => {
  if (confidence >= 0.7) return 'bg-success/30 text-success'
  if (confidence >= 0.5) return 'bg-yellow/30 text-yellow'
  return 'bg-accent/20 text-accent'
}
</script>

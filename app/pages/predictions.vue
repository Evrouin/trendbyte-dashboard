<template>
  <div>
    <h1 class="mb-6 text-3xl font-bold">Predictions</h1>
    <p class="mb-6 text-muted">Technologies showing early signs of trending.</p>
    <div v-if="predictions?.predictions" class="grid gap-3">
      <div
        v-for="p in predictions.predictions"
        :key="p.name"
        class="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4"
      >
        <div>
          <p class="font-semibold">{{ p.name }}</p>
          <p class="mt-1 text-xs text-muted">{{ p.signals.join(', ') }}</p>
        </div>
        <div class="text-right">
          <span class="rounded-full bg-success/20 px-3 py-1 text-sm font-medium text-success">
            {{ (p.confidence * 100).toFixed(0) }}%
          </span>
          <p class="mt-1 text-xs text-muted">
            {{ new Date(p.predicted_at).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { fetchPredictions } = useApi()
const { data: predictions } = await fetchPredictions({ limit: 20 })
</script>

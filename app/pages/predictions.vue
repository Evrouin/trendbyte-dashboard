<template>
  <div>
    <h1 class="mb-6 text-3xl font-extrabold text-text">Predictions</h1>
    <p class="mb-6 text-text-secondary">Technologies showing early signs of trending.</p>
    <div v-if="predictions?.predictions" class="grid gap-3">
      <div
        v-for="p in predictions.predictions"
        :key="p.name"
        class="glass-card flex items-center justify-between px-6 py-5"
      >
        <div>
          <p class="font-bold text-text">{{ p.name }}</p>
          <p class="mt-1 text-xs text-text-muted">{{ p.signals.join(', ') }}</p>
        </div>
        <div class="text-right">
          <span class="rounded-full bg-success/30 px-3 py-1 text-sm font-bold text-success">
            {{ (p.confidence * 100).toFixed(0) }}%
          </span>
          <p class="mt-1 text-xs text-text-muted">
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

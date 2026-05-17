<template>
  <div>
    <section class="mb-8">
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <p class="mt-1 text-muted">Tech trend intelligence overview</p>
    </section>

    <section v-if="stats" class="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
      <div class="rounded-xl border border-border bg-surface p-5">
        <p class="text-3xl font-bold">{{ stats.total_mentions.toLocaleString() }}</p>
        <p class="mt-1 text-sm text-muted">Mentions</p>
      </div>
      <div class="rounded-xl border border-border bg-surface p-5">
        <p class="text-3xl font-bold">{{ stats.total_trends }}</p>
        <p class="mt-1 text-sm text-muted">Trends</p>
      </div>
      <div class="rounded-xl border border-border bg-surface p-5">
        <p class="text-3xl font-bold">{{ stats.total_predictions }}</p>
        <p class="mt-1 text-sm text-muted">Predictions</p>
      </div>
      <div class="rounded-xl border border-border bg-surface p-5">
        <p class="text-3xl font-bold">{{ stats.active_sources.length }}</p>
        <p class="mt-1 text-sm text-muted">Sources</p>
      </div>
    </section>

    <section v-if="trends?.trends" class="mb-10">
      <h2 class="mb-4 text-xl font-semibold">Top Trends</h2>
      <div class="overflow-hidden rounded-xl border border-border bg-surface">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-border text-muted">
            <tr>
              <th class="px-4 py-3">#</th>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Score</th>
              <th class="px-4 py-3">Growth</th>
              <th class="px-4 py-3">Sources</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(trend, i) in trends.trends"
              :key="trend.name"
              class="border-b border-border last:border-0"
            >
              <td class="px-4 py-3 text-muted">{{ i + 1 }}</td>
              <td class="px-4 py-3 font-medium">
                <NuxtLink :to="`/trends/${trend.name}`" class="text-accent hover:underline">
                  {{ trend.name }}
                </NuxtLink>
              </td>
              <td class="px-4 py-3">{{ Math.round(trend.score).toLocaleString() }}</td>
              <td class="px-4 py-3">
                <span :class="trend.growth_pct >= 0 ? 'text-success' : 'text-warning'">
                  {{ trend.growth_pct >= 0 ? '+' : '' }}{{ trend.growth_pct.toFixed(1) }}%
                </span>
              </td>
              <td class="px-4 py-3 text-muted">{{ trend.sources.join(', ') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="predictions?.predictions?.length">
      <h2 class="mb-4 text-xl font-semibold">Rising Stars</h2>
      <div class="grid gap-3">
        <div
          v-for="p in predictions.predictions"
          :key="p.name"
          class="flex items-center gap-4 rounded-lg border border-border bg-surface px-4 py-3"
        >
          <span class="font-semibold">{{ p.name }}</span>
          <span class="rounded-full bg-success/20 px-2 py-0.5 text-xs font-medium text-success">
            {{ (p.confidence * 100).toFixed(0) }}%
          </span>
          <span class="text-xs text-muted">{{ p.signals.join(', ') }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { fetchStats, fetchTrends, fetchPredictions } = useApi()

const { data: stats } = await fetchStats()
const { data: trends } = await fetchTrends({ days: 7, limit: 10 })
const { data: predictions } = await fetchPredictions({ limit: 5 })
</script>

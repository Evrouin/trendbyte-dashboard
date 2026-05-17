<template>
  <div>
    <section class="mb-8">
      <h1 class="text-3xl font-extrabold">Dashboard</h1>
      <p class="mt-1 text-text-secondary">Tech trend intelligence overview</p>
    </section>

    <SkeletonLoader v-if="statsPending" />
    <section v-else-if="stats" class="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
      <div class="glass-card p-6">
        <p class="text-3xl font-extrabold">{{ stats.total_mentions.toLocaleString() }}</p>
        <p class="mt-1 text-sm text-text-secondary">Mentions</p>
      </div>
      <div class="glass-card p-6">
        <p class="text-3xl font-extrabold">{{ stats.total_trends }}</p>
        <p class="mt-1 text-sm text-text-secondary">Trends</p>
      </div>
      <div class="glass-card p-6">
        <p class="text-3xl font-extrabold">{{ stats.total_predictions }}</p>
        <p class="mt-1 text-sm text-text-secondary">Predictions</p>
      </div>
      <div class="glass-card p-6">
        <p class="text-3xl font-extrabold">{{ stats.active_sources.length }}</p>
        <p class="mt-1 text-sm text-text-secondary">Sources</p>
      </div>
    </section>

    <SkeletonLoader v-if="trendsPending" />
    <ErrorState v-else-if="trendsError" message="Failed to load trends" :retry="true" @retry="refreshTrends" />
    <template v-else-if="trends?.trends">
      <section class="mb-10">
        <h2 class="mb-4 text-xl font-bold">Trend Scores</h2>
        <div class="glass-card p-6" style="height: 300px">
          <ClientOnly>
            <BarChart
              :labels="trends.trends.map((t) => t.name)"
              :values="trends.trends.map((t) => Math.round(t.score))"
            />
          </ClientOnly>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="mb-4 text-xl font-bold">Top Trends</h2>
        <div class="glass-card overflow-hidden">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-border text-text-secondary">
              <tr>
                <th class="px-5 py-3 font-semibold">#</th>
                <th class="px-5 py-3 font-semibold">Name</th>
                <th class="px-5 py-3 font-semibold">Score</th>
                <th class="px-5 py-3 font-semibold">Growth</th>
                <th class="px-5 py-3 font-semibold">Sources</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(trend, i) in trends.trends"
                :key="trend.name"
                class="border-b border-border-subtle last:border-0 transition hover:bg-surface-hover"
              >
                <td class="px-5 py-3 text-text-secondary">{{ i + 1 }}</td>
                <td class="px-5 py-3 font-bold">
                  <NuxtLink :to="`/trends/${trend.name}`" class="text-accent hover:underline">
                    {{ trend.name }}
                  </NuxtLink>
                </td>
                <td class="px-5 py-3">{{ Math.round(trend.score).toLocaleString() }}</td>
                <td class="px-5 py-3">
                  <span
                    class="rounded-full px-2 py-0.5 text-xs font-semibold"
                    :class="
                      trend.growth_pct >= 0
                        ? 'bg-success/20 text-success'
                        : 'bg-warning/20 text-warning'
                    "
                  >
                    {{ trend.growth_pct >= 0 ? '+' : '' }}{{ trend.growth_pct.toFixed(1) }}%
                  </span>
                </td>
                <td class="px-5 py-3 text-text-secondary">{{ trend.sources.join(', ') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <SkeletonLoader v-if="predPending" />
    <section v-else-if="predictions?.predictions?.length">
      <h2 class="mb-4 text-xl font-bold">Rising Stars</h2>
      <div class="grid gap-3">
        <div
          v-for="p in predictions.predictions"
          :key="p.name"
          class="glass-card flex items-center gap-4 px-5 py-4"
        >
          <span class="font-bold">{{ p.name }}</span>
          <span class="rounded-full bg-success/30 px-2.5 py-0.5 text-xs font-semibold text-success">
            {{ (p.confidence * 100).toFixed(0) }}%
          </span>
          <span class="text-xs text-text-muted">{{ p.signals.join(', ') }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { fetchStats, fetchTrends, fetchPredictions } = useApi()

const { data: stats, pending: statsPending } = await fetchStats()
const {
  data: trends,
  pending: trendsPending,
  error: trendsError,
  refresh: refreshTrends,
} = await fetchTrends({ days: 7, limit: 10 })
const { data: predictions, pending: predPending } = await fetchPredictions({ limit: 5 })

// Auto-refresh every 5 minutes
const refreshInterval = setInterval(() => {
  refreshTrends()
}, 5 * 60 * 1000)

onUnmounted(() => clearInterval(refreshInterval))
</script>

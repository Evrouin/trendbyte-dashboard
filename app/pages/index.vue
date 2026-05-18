<template>
  <div>
    <section class="mb-8">
      <h1 class="text-3xl font-extrabold">Dashboard</h1>
      <p class="text-text-secondary mt-1">Tech trend intelligence overview</p>
    </section>

    <section v-if="stats" class="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
      <NuxtLink to="/news" class="glass-card hover:bg-surface-hover p-6 transition">
        <p class="text-3xl font-extrabold">{{ stats.total_mentions.toLocaleString() }}</p>
        <p class="text-text-secondary mt-1 text-sm">Mentions</p>
      </NuxtLink>
      <NuxtLink to="/trends" class="glass-card hover:bg-surface-hover p-6 transition">
        <p class="text-3xl font-extrabold">{{ stats.total_trends }}</p>
        <p class="text-text-secondary mt-1 text-sm">Trends</p>
      </NuxtLink>
      <NuxtLink to="/predictions" class="glass-card hover:bg-surface-hover p-6 transition">
        <p class="text-3xl font-extrabold">{{ stats.total_predictions }}</p>
        <p class="text-text-secondary mt-1 text-sm">Predictions</p>
      </NuxtLink>
      <NuxtLink to="/news" class="glass-card hover:bg-surface-hover p-6 transition">
        <p class="text-3xl font-extrabold">{{ stats.active_sources.length }}</p>
        <p class="text-text-secondary mt-1 text-sm">Sources</p>
      </NuxtLink>
    </section>

    <section v-if="trends?.trends" class="mb-10">
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

    <ErrorState
      v-if="trendsError"
      message="Failed to load trends"
      :retry="true"
      @retry="refreshTrends"
    />

    <section v-if="trends?.trends" class="mb-10">
      <h2 class="mb-4 text-xl font-bold">Top Trends</h2>
      <div class="glass-card overflow-hidden">
        <table class="w-full text-left text-sm">
          <thead class="border-border text-text-secondary border-b">
            <tr>
              <th class="px-5 py-3 font-semibold">#</th>
              <th class="px-5 py-3 font-semibold">Name</th>
              <th class="px-5 py-3 font-semibold">Category</th>
              <th class="px-5 py-3 font-semibold">Score</th>
              <th class="px-5 py-3 font-semibold">Growth</th>
              <th class="px-5 py-3 font-semibold">Sources</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(trend, i) in trends.trends.slice(0, 5)"
              :key="trend.name"
              class="border-border-subtle hover:bg-surface-hover border-b transition last:border-0"
            >
              <td class="text-text-secondary px-5 py-3">{{ i + 1 }}</td>
              <td class="px-5 py-3 font-bold">
                <NuxtLink :to="`/trends/${trend.name}`" class="text-accent hover:underline">
                  {{ trend.name }}
                </NuxtLink>
              </td>
              <td class="text-text-secondary px-5 py-3 text-xs">{{ trend.category || '—' }}</td>
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
              <td class="text-text-secondary px-5 py-3">{{ trend.sources.join(', ') }}</td>
            </tr>
          </tbody>
        </table>
        <div class="border-border border-t px-5 py-3 text-center">
          <NuxtLink to="/trends" class="text-accent text-sm font-medium hover:underline">
            See all trends →
          </NuxtLink>
        </div>
      </div>
    </section>

    <section v-if="predictions?.predictions?.length">
      <h2 class="mb-4 text-xl font-bold">Rising Stars</h2>
      <div class="grid gap-3">
        <div
          v-for="p in predictions.predictions"
          :key="p.name"
          class="glass-card flex items-center gap-4 px-5 py-4"
        >
          <span class="font-bold">{{ p.name }}</span>
          <span class="bg-success/30 text-success rounded-full px-2.5 py-0.5 text-xs font-semibold">
            {{ (p.confidence * 100).toFixed(0) }}%
          </span>
          <span class="text-text-muted text-xs">{{ p.signals.map(formatSignal).join(', ') }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { formatSignal } from '~/utils/formatSignal'
useHead({ title: 'Overview — TrendByte' })

const config = useRuntimeConfig()
const baseUrl = config.public.apiUrl

const { data: stats } = useFetch<import('~/types').Stats>(`${baseUrl}/api/stats`, { lazy: true })
const {
  data: trends,
  error: trendsError,
  refresh: refreshTrends,
} = useFetch<{ trends: import('~/types').Trend[]; count: number }>(`${baseUrl}/api/trends`, {
  params: { days: 7, limit: 10 },
  lazy: true,
})
const { data: predictions } = useFetch<{
  predictions: import('~/types').Prediction[]
  count: number
}>(`${baseUrl}/api/predictions`, { params: { limit: 5 }, lazy: true })

onMounted(() => {
  const interval = setInterval(
    () => {
      refreshTrends()
    },
    5 * 60 * 1000,
  )
  onUnmounted(() => clearInterval(interval))
})
</script>

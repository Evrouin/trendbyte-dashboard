<template>
  <div>
    <section class="mb-8">
      <h1 class="text-3xl font-extrabold">Dashboard</h1>
      <p class="text-text-secondary mt-1">
        Tech trend intelligence overview
        <span v-if="stats?.last_run" class="text-text-muted ml-2 text-xs">
          · Updated {{ formatRelative(stats.last_run) }}
        </span>
      </p>
    </section>

    <section v-if="!store.stats" class="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
      <Skeleton h="h-24" />
      <Skeleton h="h-24" />
      <Skeleton h="h-24" />
      <Skeleton h="h-24" />
    </section>

    <section v-else class="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
      <NuxtLink
        to="/news"
        class="glass-card tooltip hover:bg-surface-hover p-6 transition"
        data-tooltip="Total collected data points"
      >
        <p class="text-3xl font-extrabold"><AnimatedCounter :value="stats.total_mentions" /></p>
        <p class="text-text-secondary mt-1 text-sm">Mentions</p>
      </NuxtLink>
      <NuxtLink
        to="/trends"
        class="glass-card tooltip hover:bg-surface-hover p-6 transition"
        data-tooltip="Unique technologies tracked"
      >
        <p class="text-3xl font-extrabold"><AnimatedCounter :value="stats.total_trends" /></p>
        <p class="text-text-secondary mt-1 text-sm">Trends</p>
      </NuxtLink>
      <NuxtLink
        to="/predictions"
        class="glass-card tooltip hover:bg-surface-hover p-6 transition"
        data-tooltip="ML rising star predictions"
      >
        <p class="text-3xl font-extrabold"><AnimatedCounter :value="stats.total_predictions" /></p>
        <p class="text-text-secondary mt-1 text-sm">Predictions</p>
      </NuxtLink>
      <NuxtLink
        to="/news"
        class="glass-card tooltip hover:bg-surface-hover p-6 transition"
        data-tooltip="Total collected data points"
      >
        <p class="text-3xl font-extrabold">
          <AnimatedCounter :value="stats.active_sources.length" />
        </p>
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
        <table class="hidden w-full text-left text-sm md:table">
          <thead class="border-border text-text-secondary border-b">
            <tr>
              <th class="px-5 py-3 font-semibold">#</th>
              <th class="px-5 py-3 font-semibold">Name</th>
              <th class="px-5 py-3 font-semibold">Mentions</th>
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
              <td class="px-5 py-3">{{ Math.round(trend.mentions) }}</td>
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

        <div class="grid gap-3 p-4 md:hidden">
          <NuxtLink
            v-for="(trend, i) in trends.trends.slice(0, 5)"
            :key="trend.name"
            :to="`/trends/${trend.name}`"
            class="glass-card flex items-center justify-between p-4"
          >
            <div>
              <p class="text-accent font-bold">{{ i + 1 }}. {{ trend.name }}</p>
              <p class="text-text-secondary text-xs">
                {{ trend.mentions }} mentions · {{ trend.sources.join(', ') }}
              </p>
            </div>
            <div class="text-right">
              <p class="font-semibold">{{ Math.round(trend.score).toLocaleString() }}</p>
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
            </div>
          </NuxtLink>
        </div>

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
          <NuxtLink :to="`/trends/${p.name}`" class="text-accent font-bold hover:underline">
            {{ p.name }}
          </NuxtLink>
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
import { useTrendsStore } from '~/stores/trends'

useHead({ title: 'Overview — TrendByte' })

const formatRelative = (date: string) => {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const store = useTrendsStore()
await store.fetchStats()
await store.fetchTrends(7, 10)
await store.fetchPredictions(5)

const stats = computed(() => store.stats)
const trends = computed(() => ({ trends: store.trends }))
const predictions = computed(() => ({ predictions: store.predictions }))
const trendsError = ref(false)

const { show: showToast } = useToast()

const refreshTrends = async () => {
  store.invalidate()
  await store.fetchTrends(7, 10)
  await store.fetchStats()
  showToast('Data refreshed')
}

onMounted(() => {
  const interval = setInterval(() => refreshTrends(), 5 * 60 * 1000)
  onUnmounted(() => clearInterval(interval))
})
</script>

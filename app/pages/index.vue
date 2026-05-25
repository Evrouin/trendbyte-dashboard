<template>
  <div>
    <section class="mb-8">
      <h1 class="text-3xl font-extrabold">Dashboard</h1>
      <p class="text-text-secondary mt-1">
        Tech trend intelligence overview
        <ClientOnly>
          <span v-if="stats?.last_run" class="text-text-muted ml-2 text-xs">
            · Updated {{ formatRelative(stats.last_run) }}
          </span>
        </ClientOnly>
      </p>
    </section>

    <!-- Daily Signal Drop -->
    <section v-if="daily" class="mb-10">
      <h2 class="mb-4 text-xl font-bold">Daily Signal Drop</h2>
      <div class="glass-card border-accent/30 relative overflow-hidden border p-8">
        <p class="text-text-secondary mb-2 text-sm font-medium tracking-wide uppercase">
          Today's Signal
        </p>
        <h3 class="text-2xl font-extrabold md:text-3xl">{{ daily.headline }}</h3>
        <div class="mt-4 flex items-baseline gap-3">
          <span class="text-accent text-4xl font-extrabold">{{ daily.stat?.value }}</span>
          <span class="text-text-secondary text-sm">{{ daily.stat?.label }}</span>
          <span
            v-if="daily.stat?.delta"
            class="bg-success/20 text-success rounded-full px-2 py-0.5 text-xs font-semibold"
          >
            Score {{ Number(daily.stat.delta).toLocaleString() }}
          </span>
        </div>
        <p class="text-text-muted mt-4 text-sm">{{ daily.takeaway }}</p>
        <span
          v-if="daily.source_badge"
          class="bg-surface-hover text-text-secondary absolute right-4 bottom-4 rounded-full px-3 py-1 text-xs"
        >
          {{ daily.source_badge }}
        </span>
      </div>
    </section>

    <!-- Weekly Recap -->
    <section v-if="weekly" class="mb-10">
      <h2 class="mb-4 text-xl font-bold">Weekly Recap</h2>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div class="glass-card p-4">
          <p class="text-text-secondary text-xs font-medium">Most Discussed</p>
          <p class="mt-1 text-lg font-bold">{{ weekly.most_discussed?.name }}</p>
          <p class="text-text-muted text-xs">{{ weekly.most_discussed?.mentions }} mentions</p>
        </div>
        <div class="glass-card p-4">
          <p class="text-text-secondary text-xs font-medium">Rising Tool</p>
          <p class="mt-1 text-lg font-bold">{{ weekly.rising_tool?.name }}</p>
          <p class="text-success text-xs">+{{ formatGrowth(weekly.rising_tool?.growth_pct) }}%</p>
        </div>
        <div class="glass-card p-4">
          <p class="text-text-secondary text-xs font-medium">Community Vibe</p>
          <p class="mt-1 text-lg font-bold">
            {{ formatVibe(weekly.community_vibe?.average_sentiment) }}
          </p>
          <p class="text-text-muted text-xs">{{ weekly.community_vibe?.top_positive }} leading</p>
        </div>
        <div class="glass-card p-4">
          <p class="text-text-secondary text-xs font-medium">Faded</p>
          <p class="mt-1 text-lg font-bold">{{ weekly.faded?.name }}</p>
          <p class="text-red text-xs">{{ formatGrowth(weekly.faded?.growth_pct) }}%</p>
        </div>
      </div>
    </section>

    <!-- Stats row -->
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
        <p class="text-3xl font-extrabold">
          <AnimatedCounter :value="stats?.total_mentions ?? 0" />
        </p>
        <p class="text-text-secondary mt-1 text-sm">Mentions</p>
      </NuxtLink>
      <NuxtLink
        to="/trends"
        class="glass-card tooltip hover:bg-surface-hover p-6 transition"
        data-tooltip="Unique technologies tracked"
      >
        <p class="text-3xl font-extrabold"><AnimatedCounter :value="stats?.total_trends ?? 0" /></p>
        <p class="text-text-secondary mt-1 text-sm">Trends</p>
      </NuxtLink>
      <NuxtLink
        to="/predictions"
        class="glass-card tooltip hover:bg-surface-hover p-6 transition"
        data-tooltip="ML rising star predictions"
      >
        <p class="text-3xl font-extrabold">
          <AnimatedCounter :value="stats?.total_predictions ?? 0" />
        </p>
        <p class="text-text-secondary mt-1 text-sm">Predictions</p>
      </NuxtLink>
      <NuxtLink
        to="/news"
        class="glass-card tooltip hover:bg-surface-hover p-6 transition"
        data-tooltip="Total collected data points"
      >
        <p class="text-3xl font-extrabold">
          <AnimatedCounter :value="stats?.active_sources?.length ?? 0" />
        </p>
        <p class="text-text-secondary mt-1 text-sm">Sources</p>
      </NuxtLink>
    </section>

    <!-- Trend Scores Chart -->
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

    <!-- Top Trends table -->
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

    <!-- Rising Stars -->
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

const config = useRuntimeConfig()

const formatGrowth = (val: number | undefined) => {
  if (!val) return '0'
  const clamped = Math.max(-999, Math.min(999, Math.round(val)))
  return clamped > 0 ? `${clamped}` : `${clamped}`
}

const formatVibe = (val: number | undefined) => {
  if (!val) return 'Neutral'
  if (val > 0.2) return 'Positive'
  if (val < -0.2) return 'Negative'
  return 'Neutral'
}

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

// Content card data
const { data: daily } = await useFetch<Record<string, any>>(
  `${config.public.apiUrl}/api/content/daily`,
)
const { data: weekly } = await useFetch<Record<string, any>>(
  `${config.public.apiUrl}/api/content/weekly`,
)

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

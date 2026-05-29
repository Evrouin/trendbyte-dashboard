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
      <NuxtLink
        :to="trendPath(daily.trend_name)"
        class="glass-card border-accent/30 hover:border-accent/50 relative block overflow-hidden border p-8 transition"
      >
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
        <p class="text-text-muted mt-4 text-xs md:text-sm">{{ daily.takeaway }}</p>
        <span
          v-if="daily.source_badge"
          class="bg-surface-hover text-text-secondary mt-4 inline-block rounded-full px-3 py-1 text-xs md:absolute md:right-4 md:bottom-4 md:mt-0"
        >
          {{ daily.source_badge }}
        </span>
      </NuxtLink>
    </section>

    <!-- Weekly Recap -->
    <section v-if="weekly" class="mb-10">
      <h2 class="mb-4 text-xl font-bold">Weekly Recap</h2>
      <div class="grid grid-cols-1 gap-4 min-[375px]:grid-cols-2 md:grid-cols-4">
        <div
          class="glass-card tooltip min-w-0 cursor-pointer p-4"
          data-tooltip="Most mentioned tech this week"
        >
          <p class="text-text-secondary text-xs font-medium">Most Discussed</p>
          <p class="mt-1 flex items-center gap-1.5 truncate text-lg font-bold">
            <TechIcon :name="weekly.most_discussed?.name || ''" size="sm" />
            {{ weekly.most_discussed?.name }}
          </p>
          <p class="text-text-muted text-xs">{{ weekly.most_discussed?.mentions }} mentions</p>
        </div>
        <div
          class="glass-card tooltip min-w-0 cursor-pointer p-4"
          data-tooltip="Emerging tech with fastest growth"
        >
          <p class="text-text-secondary text-xs font-medium">Rising Tool</p>
          <p class="mt-1 flex items-center gap-1.5 truncate text-lg font-bold">
            <TechIcon :name="weekly.rising_tool?.name || ''" size="sm" />
            {{ weekly.rising_tool?.name }}
          </p>
          <p class="text-success text-xs">+{{ formatGrowth(weekly.rising_tool?.growth_pct) }}%</p>
        </div>
        <div
          class="glass-card tooltip min-w-0 cursor-pointer p-4"
          data-tooltip="Overall community sentiment this week"
        >
          <p class="text-text-secondary text-xs font-medium">Community Vibe</p>
          <div class="mt-1 flex items-center gap-1.5">
            <TechIcon :name="weekly.community_vibe?.top_positive || ''" size="sm" />
            <span class="truncate text-sm font-bold">{{
              weekly.community_vibe?.top_positive
            }}</span>
          </div>
          <div
            class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"
          >
            <div
              class="h-full w-1.5 rounded-full bg-white shadow"
              :style="{
                marginLeft: `${(((weekly.community_vibe?.average_sentiment || 0) + 1) / 2) * 100}%`,
              }"
            />
          </div>
          <p class="text-text-muted mt-1 text-[10px]">
            {{ formatVibe(weekly.community_vibe?.average_sentiment) }}
          </p>
        </div>
        <div
          class="glass-card tooltip min-w-0 cursor-pointer p-4"
          data-tooltip="Tech losing momentum this week"
        >
          <p class="text-text-secondary text-xs font-medium">Faded</p>
          <p class="mt-1 flex items-center gap-1.5 truncate text-lg font-bold">
            <TechIcon :name="weekly.faded?.name || ''" size="sm" /> {{ weekly.faded?.name }}
          </p>
          <p class="text-red text-xs">{{ formatGrowth(weekly.faded?.growth_pct) }}%</p>
        </div>
      </div>
    </section>

    <!-- Stats row -->
    <section
      v-if="!store.stats"
      class="mb-10 grid grid-cols-1 gap-4 min-[375px]:grid-cols-2 md:grid-cols-4"
    >
      <Skeleton h="h-24" />
      <Skeleton h="h-24" />
      <Skeleton h="h-24" />
      <Skeleton h="h-24" />
    </section>

    <section v-else class="mb-10 grid grid-cols-1 gap-4 min-[375px]:grid-cols-2 md:grid-cols-4">
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
              <th class="px-5 py-3"></th>
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
              <td class="px-5 py-3">
                <span
                  class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                  :class="
                    i === 0
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : i === 1
                        ? 'bg-gray-300/20 text-gray-300'
                        : i === 2
                          ? 'bg-orange-400/20 text-orange-400'
                          : 'bg-surface-hover text-text-muted'
                  "
                  >{{ i + 1 }}</span
                >
              </td>
              <td class="px-5 py-3 font-bold">
                <NuxtLink :to="trendPath(trend.name)" class="text-accent hover:underline">
                  <TechIcon :name="trend.name" size="sm" /> {{ trend.name }}
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
            :to="trendPath(trend.name)"
            class="glass-card flex items-center justify-between p-4"
          >
            <div class="flex items-center gap-3">
              <span
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                :class="
                  i === 0
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : i === 1
                      ? 'bg-gray-300/20 text-gray-300'
                      : i === 2
                        ? 'bg-orange-400/20 text-orange-400'
                        : 'bg-surface-hover text-text-muted'
                "
                >{{ i + 1 }}</span
              >
              <div>
                <p class="text-accent flex items-center gap-1.5 font-bold">
                  <TechIcon :name="trend.name" size="sm" /> {{ trend.name }}
                </p>
                <p class="text-text-secondary text-xs">
                  {{ trend.mentions }} mentions · {{ trend.sources.join(', ') }}
                </p>
              </div>
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
    <section v-if="risingStars.length">
      <h2 class="mb-4 text-xl font-bold">Rising Stars</h2>
      <div class="glass-card overflow-hidden">
        <div
          v-for="p in risingStars"
          :key="p.name"
          class="border-border flex flex-wrap items-center gap-2 border-b px-5 py-4 last:border-0 md:gap-4"
        >
          <NuxtLink
            :to="trendPath(p.name)"
            class="text-accent flex items-center gap-1.5 font-bold hover:underline"
          >
            <TechIcon :name="p.name" size="sm" /> {{ p.name }}
          </NuxtLink>
          <span
            class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            :class="
              p.confidence >= 0.7
                ? 'bg-success/30 text-success'
                : p.confidence >= 0.5
                  ? 'bg-yellow/30 text-yellow'
                  : 'bg-accent/20 text-accent'
            "
          >
            {{ (p.confidence * 100).toFixed(0) }}%
          </span>
          <span class="text-text-muted text-xs">{{ p.signals.map(formatSignal).join(', ') }}</span>
        </div>
        <div class="border-border border-t px-5 py-3 text-center">
          <NuxtLink to="/predictions" class="text-accent text-sm font-medium hover:underline">
            See all predictions →
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { formatSignal } from '~/utils/formatSignal'
import { useTrendsStore } from '~/stores/trends'

useHead({ title: 'Dashboard — TrendByte' })

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
await Promise.all([store.fetchStats(), store.fetchTrends(7, 10)])

const { data: risingData } = await useFetch<{ predictions: any[] }>(
  `${config.public.apiUrl}/api/predictions`,
  { params: { limit: 5 }, lazy: true },
)
const { data: daily } = await useFetch<Record<string, any>>(
  `${config.public.apiUrl}/api/content/daily`,
  { lazy: true },
)
const { data: weekly } = await useFetch<Record<string, any>>(
  `${config.public.apiUrl}/api/content/weekly`,
  { lazy: true },
)
const risingStars = computed(() => risingData.value?.predictions || [])

const stats = computed(() => store.stats)
const trends = computed(() => ({ trends: store.trends }))
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

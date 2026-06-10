<template>
  <div v-if="data?.trend">
    <div class="mb-4 flex items-center justify-between">
      <NuxtLink to="/trends" class="text-text-secondary hover:text-accent text-sm transition">
        &larr; Back to trends
      </NuxtLink>
      <button
        class="text-text-secondary hover:text-accent relative text-sm transition"
        @click="share"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
        <span
          v-if="copied"
          class="text-accent absolute top-1/2 right-full mr-2 -translate-y-1/2 text-xs whitespace-nowrap"
        >
          Copied
        </span>
      </button>
    </div>

    <h1 class="mb-2 flex items-center gap-2 text-3xl font-extrabold">
      <TechIcon :name="data.trend.name" size="md" /> {{ data.trend.name }}
    </h1>
    <div class="text-text-secondary mb-8 flex flex-wrap items-center gap-4 text-sm">
      <span>Score: {{ Math.round(data.trend.score).toLocaleString() }}</span>
      <span>Sources: {{ data.trend.sources.join(', ') }}</span>
      <TrendBadges
        :sources="data.trend.sources"
        :growth-pct="data.trend.growth_pct"
        :lifecycle="lifecycle?.phase"
      />
    </div>

    <p class="text-text-secondary mb-8 text-sm">
      {{ data.trend.name }} has {{ data.trend.mentions }} mentions across
      {{ data.trend.sources.length }} sources with a score of
      {{ Math.round(data.trend.score).toLocaleString() }}
    </p>

    <div class="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section
        v-if="data.history.length"
        class="glass-card h-[250px] overflow-hidden p-4 md:h-[350px] md:p-6 lg:col-span-2"
      >
        <div class="mb-3 flex gap-1">
          <button
            v-for="g in ['daily', 'weekly', 'monthly']"
            :key="g"
            class="rounded px-2.5 py-1 text-xs font-medium transition"
            :class="
              granularity === g ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:text-text'
            "
            @click="granularity = g"
          >
            {{ g.charAt(0).toUpperCase() + g.slice(1) }}
          </button>
        </div>
        <ClientOnly>
          <LineChart
            :labels="
              data.history.map((h) => {
                const d = new Date(h.calculated_at)
                return `${d.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]}`
              })
            "
            :values="data.history.map((h) => Math.round(h.score))"
            title="Score Over Time"
          />
        </ClientOnly>
      </section>

      <section
        v-if="sourceBreakdown.labels.length"
        class="glass-card flex min-h-[250px] flex-col overflow-hidden p-6 md:h-[300px]"
      >
        <h3 class="text-text-secondary mb-2 text-xs font-semibold uppercase">Source Breakdown</h3>
        <ClientOnly>
          <div class="min-h-0 flex-1">
            <PieChart :labels="sourceBreakdown.labels" :values="sourceBreakdown.values" />
          </div>
        </ClientOnly>
      </section>
    </div>

    <section v-if="data.posts?.length" class="mb-10">
      <h2 class="mb-4 text-xl font-bold">Top Posts</h2>
      <div class="mb-4 grid gap-4 md:grid-cols-3">
        <a
          v-for="post in data.posts.slice(0, 3)"
          :key="post.url"
          :href="post.url"
          target="_blank"
          class="glass-card hover:border-accent/30 flex flex-col justify-between p-5 transition"
        >
          <p class="line-clamp-3 leading-snug font-medium">{{ post.description || post.url }}</p>
          <div class="text-text-muted mt-3 flex items-center gap-2 text-xs">
            <span class="border-border-subtle rounded border px-1.5 py-0.5">{{ post.source }}</span>
            <span v-if="post.stars" class="font-semibold">{{ post.stars }} pts</span>
          </div>
        </a>
      </div>
      <div v-if="data.posts.length > 3" class="glass-card overflow-hidden">
        <a
          v-for="post in data.posts.slice(3)"
          :key="post.url"
          :href="post.url"
          target="_blank"
          class="border-border hover:bg-surface-hover flex items-center gap-3 border-b px-5 py-3 transition last:border-0"
        >
          <span
            class="border-border-subtle text-text-muted shrink-0 rounded border px-1.5 py-0.5 text-[10px]"
            >{{ post.source }}</span
          >
          <span class="min-w-0 flex-1 truncate text-sm">{{ post.description || post.url }}</span>
          <span v-if="post.stars" class="text-text-muted shrink-0 text-xs"
            >{{ post.stars }} pts</span
          >
        </a>
      </div>
    </section>

    <section v-if="data.related?.length" class="mb-10">
      <h2 class="mb-4 text-xl font-bold">Related Trends</h2>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="r in data.related"
          :key="r.name"
          :to="trendPath(r.name)"
          class="glass-card hover:bg-surface-hover flex items-center gap-1.5 px-4 py-2 text-sm transition"
        >
          <TechIcon :name="r.name" size="sm" />
          <span class="text-accent font-medium">{{ r.name }}</span>
          <span class="text-text-muted ml-2 text-xs">{{
            Math.round(r.score).toLocaleString()
          }}</span>
        </NuxtLink>
      </div>
    </section>
  </div>
  <div v-else class="py-20 text-center">
    <p class="text-text-secondary text-lg">No trend data available yet for this technology.</p>
    <NuxtLink to="/trends" class="text-accent mt-4 inline-block text-sm hover:underline">
      &larr; Back to trends
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { show: showToast } = useToast()

const config = useRuntimeConfig()

const sanitizeParam = (param: string | string[] | undefined): string => {
  const raw = Array.isArray(param) ? (param[0] ?? '') : (param ?? '')
  return raw
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, 200)
}

const safeName = sanitizeParam(route.params.name)

useHead({ title: `${safeName} — TrendByte` })

const granularity = ref('weekly')

const { data } = await useFetch<{
  trend: { name: string; score: number; sources: string[]; mentions: number; growth_pct: number }
  history: { score: number; calculated_at: string }[]
  posts: {
    source: string
    name: string
    url: string
    description: string
    stars: number
    collected_at: string
  }[]
  related: { name: string; score: number }[]
}>(`${config.public.apiUrl}/api/trends/${safeName}`, {
  lazy: true,
  query: computed(() => ({ granularity: granularity.value })),
})

const { data: lifecycle } = await useFetch<{ phase: string; momentum: number }>(
  `${config.public.apiUrl}/api/trends/${safeName}/lifecycle`,
  { lazy: true },
)

useSeoMeta({
  title: () =>
    data.value?.trend ? `${data.value.trend.name} — TrendByte` : `${safeName} — TrendByte`,
  description: () =>
    data.value?.trend
      ? `${data.value.trend.name} has a score of ${Math.round(data.value.trend.score)} across ${data.value.trend.sources.join(', ')}.`
      : `Trend details for ${safeName}`,
})

const lifecycleClass = computed(() => {
  const phase = lifecycle.value?.phase
  if (phase === 'rising') return 'bg-success/20 text-success'
  if (phase === 'peaking') return 'bg-warning/20 text-warning'
  if (phase === 'declining') return 'bg-red/20 text-red'
  return 'bg-accent/20 text-accent'
})

const sourceBreakdown = computed(() => {
  if (!data.value?.posts) return { labels: [], values: [] }
  const counts: Record<string, number> = {}
  for (const post of data.value.posts) {
    counts[post.source] = (counts[post.source] || 0) + 1
  }
  return {
    labels: Object.keys(counts),
    values: Object.values(counts),
  }
})

const copied = ref(false)

const share = async () => {
  await navigator.clipboard.writeText(window.location.href)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

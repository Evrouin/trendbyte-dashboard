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

    <h1 class="mb-2 text-3xl font-extrabold">{{ data.trend.name }}</h1>
    <div class="text-text-secondary mb-8 flex flex-wrap items-center gap-4 text-sm">
      <span>Score: {{ Math.round(data.trend.score).toLocaleString() }}</span>
      <span>Sources: {{ data.trend.sources.join(', ') }}</span>
      <span
        v-if="lifecycle"
        class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
        :class="lifecycleClass"
      >
        {{ lifecycle.phase }}
      </span>
    </div>

    <div class="mb-10 grid gap-6 lg:grid-cols-3">
      <section
        v-if="data.history.length"
        class="glass-card p-6 lg:col-span-2"
        style="height: 300px"
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
            :labels="data.history.map((h) => new Date(h.calculated_at).toLocaleDateString())"
            :values="data.history.map((h) => Math.round(h.score))"
            title="Score Over Time"
          />
        </ClientOnly>
      </section>

      <section
        v-if="sourceBreakdown.labels.length"
        class="glass-card flex flex-col p-6"
        style="height: 300px"
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
      <h2 class="mb-4 text-xl font-bold">Related Posts</h2>
      <div class="grid gap-3">
        <a
          v-for="post in data.posts"
          :key="post.url"
          :href="post.url"
          target="_blank"
          class="glass-card hover:bg-surface-hover flex items-start gap-4 px-5 py-4 transition"
        >
          <div class="flex-1">
            <p class="leading-snug font-medium">{{ post.description }}</p>
            <div class="text-text-muted mt-2 flex items-center gap-3 text-xs">
              <span class="border-border-subtle rounded border px-1.5 py-0.5">{{
                post.source
              }}</span>
              <span v-if="post.stars">{{ post.stars }} points</span>
              <span>{{ new Date(post.collected_at).toLocaleDateString() }}</span>
            </div>
          </div>
          <span class="text-text-muted shrink-0 text-xs">&nearr;</span>
        </a>
      </div>
    </section>

    <section v-if="data.related?.length" class="mb-10">
      <h2 class="mb-4 text-xl font-bold">Related Trends</h2>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="r in data.related"
          :key="r.name"
          :to="`/trends/${r.name}`"
          class="glass-card hover:bg-surface-hover px-4 py-2 text-sm transition"
        >
          <span class="text-accent font-medium">{{ r.name }}</span>
          <span class="text-text-muted ml-2 text-xs">{{
            Math.round(r.score).toLocaleString()
          }}</span>
        </NuxtLink>
      </div>
    </section>
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

<template>
  <div>
    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-extrabold">Tech Lookup</h1>
        <p class="text-text-secondary mt-1">Instant insights on any technology.</p>
      </div>
      <div class="relative w-full md:w-64 md:shrink-0">
        <input
          v-model="query"
          type="text"
          placeholder="Search technologies..."
          class="border-border bg-surface text-text focus:border-accent w-full rounded-lg border px-4 py-2 text-sm outline-none"
          @focus="showSuggestions = true"
          @input="showSuggestions = true"
          @blur="hideSuggestions"
        />
        <div
          v-if="showSuggestions && suggestions.length"
          class="glass-card border-border absolute z-10 mt-2 max-h-60 w-full overflow-y-auto border shadow-lg"
        >
          <button
            v-for="s in suggestions"
            :key="s"
            class="text-text-secondary hover:bg-surface-hover hover:text-text flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition"
            @mousedown.prevent="select(s)"
          >
            <TechIcon :name="s" size="sm" /> {{ s }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="detail">
      <div class="glass-card border-accent/20 border p-8">
        <div class="mb-6 flex items-center gap-4">
          <TechIcon :name="detail.trend.name" size="lg" />
          <div>
            <h2 class="text-2xl font-extrabold">{{ detail.trend.name }}</h2>
            <div class="mt-1 flex flex-wrap gap-1.5">
              <TrendBadges
                :sources="detail.trend.sources"
                :growth-pct="detail.trend.growth_pct"
                :lifecycle="lifecycle"
              />
            </div>
          </div>
        </div>

        <div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div class="glass-card p-4 text-center">
            <p class="text-accent text-2xl font-extrabold">
              {{ Math.round(detail.trend.score).toLocaleString() }}
            </p>
            <p class="text-text-muted text-xs">Score</p>
          </div>
          <div class="glass-card p-4 text-center">
            <p class="text-2xl font-extrabold">{{ detail.trend.mentions }}</p>
            <p class="text-text-muted text-xs">Mentions</p>
          </div>
          <div class="glass-card p-4 text-center">
            <p class="text-2xl font-extrabold">{{ detail.trend.sources.length }}</p>
            <p class="text-text-muted text-xs">Sources</p>
          </div>
          <div class="glass-card p-4 text-center">
            <p
              class="text-2xl font-extrabold"
              :class="detail.trend.growth_pct >= 0 ? 'text-success' : 'text-red'"
            >
              {{ detail.trend.growth_pct >= 0 ? '+' : ''
              }}{{ Math.round(detail.trend.growth_pct) }}%
            </p>
            <p class="text-text-muted text-xs">Growth</p>
          </div>
        </div>

        <div v-if="historyScores.length" class="mb-6 overflow-hidden">
          <p class="text-text-secondary mb-2 text-xs font-medium uppercase">Score Trend</p>
          <SparkLine :values="historyScores" :width="300" :height="50" />
        </div>

        <div class="text-text-secondary mb-6 flex flex-wrap gap-4 text-sm">
          <span v-if="lifecycle" class="flex items-center gap-1">
            Lifecycle:
            <span class="text-accent font-semibold capitalize">{{ lifecycle }}</span>
          </span>
          <span>Sources: {{ detail.trend.sources.join(', ') }}</span>
          <span v-if="detail.trend.growth_pct"
            >Growth: {{ detail.trend.growth_pct >= 0 ? '+' : ''
            }}{{ detail.trend.growth_pct.toFixed(1) }}%</span
          >
        </div>

        <NuxtLink
          :to="`/trends/${detail.trend.name}`"
          class="text-accent inline-block text-sm font-medium hover:underline"
        >
          View full details →
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="!query" class="w-full">
      <div class="glass-card p-12 text-center">
        <svg
          class="text-text-muted mx-auto mb-4 h-12 w-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p class="text-text-secondary">Search for any technology to see its trend data.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Tech Lookup — TrendByte' })

const config = useRuntimeConfig()
const baseUrl = config.public.apiUrl
const store = useTrendsStore()
await store.fetchTrends(30, 30)

const query = ref('')
const showSuggestions = ref(false)
const detail = ref<any>(null)

const suggestions = computed(() => {
  if (!query.value) return []
  const q = query.value.toLowerCase()
  return store.trends
    .map((t) => t.name)
    .filter((n) => n.toLowerCase().includes(q))
    .slice(0, 8)
})

const lifecycle = computed(() => {
  if (!detail.value) return ''
  const g = detail.value.trend?.growth_pct || 0
  if (g > 10) return 'rising'
  if (g < -10) return 'declining'
  return 'stable'
})

const historyScores = computed(() => detail.value?.history?.map((h: any) => h.score) || [])

const hideSuggestions = () => {
  setTimeout(() => (showSuggestions.value = false), 200)
}

const select = async (name: string) => {
  query.value = name
  showSuggestions.value = false
  detail.value = await fetchWithHmac<any>(`${baseUrl}/api/trends/${name}`)
}
</script>

<template>
  <div>
    <h1 class="mb-2 text-3xl font-extrabold">Tech Lookup</h1>
    <p class="text-text-secondary mb-6">Search for any technology to see its trend data.</p>

    <div class="relative mb-6 max-w-md">
      <input
        v-model="query"
        type="text"
        placeholder="Search technologies..."
        class="border-border bg-surface text-text focus:border-accent w-full rounded-lg border px-4 py-2 text-sm outline-none"
        @focus="showSuggestions = true"
      />
      <div
        v-if="showSuggestions && suggestions.length"
        class="glass-card border-border absolute z-10 mt-1 max-h-48 w-full overflow-y-auto border shadow-lg"
      >
        <button
          v-for="s in suggestions"
          :key="s"
          class="text-text-secondary hover:bg-surface-hover hover:text-text w-full px-4 py-2 text-left text-sm transition"
          @click="select(s)"
        >
          <TechIcon :name="s" size="sm" /> {{ s }}
        </button>
      </div>
    </div>

    <div v-if="detail" class="glass-card p-6">
      <div class="mb-4 flex items-center gap-3">
        <TechIcon :name="detail.trend.name" size="md" />
        <h2 class="text-xl font-bold">{{ detail.trend.name }}</h2>
      </div>
      <div class="mb-3 flex flex-wrap gap-2">
        <TrendBadges
          :sources="detail.trend.sources"
          :growth-pct="detail.trend.growth_pct"
          :lifecycle="lifecycle"
        />
      </div>
      <div class="text-text-secondary mb-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
        <p>
          Score: <span class="text-text font-semibold">{{ Math.round(detail.trend.score) }}</span>
        </p>
        <p>
          Mentions: <span class="text-text font-semibold">{{ detail.trend.mentions }}</span>
        </p>
        <p>
          Sources:
          <span class="text-text font-semibold">{{ detail.trend.sources.join(', ') }}</span>
        </p>
      </div>
      <p v-if="lifecycle" class="text-text-secondary mb-4 text-sm">
        Lifecycle: <span class="text-accent font-semibold capitalize">{{ lifecycle }}</span>
      </p>
      <div v-if="historyScores.length" class="mb-4">
        <SparkLine :values="historyScores" :width="200" :height="40" />
      </div>
      <NuxtLink :to="`/trends/${detail.trend.name}`" class="text-accent text-sm hover:underline">
        View full details →
      </NuxtLink>
    </div>

    <div v-else-if="!query" class="glass-card p-8 text-center">
      <p class="text-text-secondary">Search for any technology to see its trend data.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrendDetail } from '~/types'

useHead({ title: 'Tech Lookup — TrendByte' })

const config = useRuntimeConfig()
const baseUrl = config.public.apiUrl
const store = useTrendsStore()
await store.fetchTrends(30, 20)

const query = ref('')
const showSuggestions = ref(false)
const detail = ref<TrendDetail | null>(null)

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
  const g = detail.value.trend.growth_pct
  if (g > 10) return 'rising'
  if (g < -10) return 'declining'
  return 'stable'
})

const historyScores = computed(() => detail.value?.history?.map((h) => h.score) || [])

const select = async (name: string) => {
  query.value = name
  showSuggestions.value = false
  detail.value = await fetchWithHmac<TrendDetail>(`${baseUrl}/api/trends/${name}`)
}
</script>

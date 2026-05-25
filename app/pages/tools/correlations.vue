<template>
  <div>
    <h1 class="mb-2 text-3xl font-extrabold">Correlation Finder</h1>
    <p class="text-text-secondary mb-6">Discover which technologies trend together.</p>

    <div class="relative mb-6 max-w-md">
      <input
        v-model="query"
        type="text"
        placeholder="Select a technology..."
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

    <div v-if="results.length" class="glass-card divide-border divide-y">
      <div v-for="r in results" :key="r.name" class="flex items-center gap-3 px-4 py-3">
        <TechIcon :name="r.name" size="sm" />
        <span class="w-28 shrink-0 text-sm font-medium">{{ r.name }}</span>
        <div class="bg-surface-hover h-3 flex-1 overflow-hidden rounded-full">
          <div
            class="bg-accent h-full rounded-full transition-all"
            :style="{ width: `${r.correlation * 100}%` }"
          />
        </div>
        <span class="text-text-secondary w-12 text-right text-xs">
          {{ (r.correlation * 100).toFixed(0) }}%
        </span>
        <span class="text-text-muted w-16 text-right text-xs">{{ r.co_occurrences }} co</span>
      </div>
    </div>

    <div v-else-if="!selected" class="glass-card p-8 text-center">
      <p class="text-text-secondary">Select a technology to find what trends alongside it.</p>
    </div>

    <div v-else-if="selected && !loading" class="glass-card p-8 text-center">
      <p class="text-text-secondary">No correlations found for {{ selected }}.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Correlation Finder — TrendByte' })

const config = useRuntimeConfig()
const baseUrl = config.public.apiUrl
const store = useTrendsStore()
await store.fetchTrends(30, 20)

const query = ref('')
const showSuggestions = ref(false)
const selected = ref('')
const loading = ref(false)
const results = ref<{ name: string; correlation: number; co_occurrences: number }[]>([])

const suggestions = computed(() => {
  if (!query.value) return []
  const q = query.value.toLowerCase()
  return store.trends
    .map((t) => t.name)
    .filter((n) => n.toLowerCase().includes(q))
    .slice(0, 8)
})

const select = async (name: string) => {
  query.value = name
  selected.value = name
  showSuggestions.value = false
  loading.value = true

  const data = await fetchWithHmac<{
    correlations: { tech_a: string; tech_b: string; correlation: number; co_occurrences: number }[]
  }>(`${baseUrl}/api/correlations`)

  results.value = data.correlations
    .filter((c) => c.tech_a === name || c.tech_b === name)
    .map((c) => ({
      name: c.tech_a === name ? c.tech_b : c.tech_a,
      correlation: c.correlation,
      co_occurrences: c.co_occurrences,
    }))
    .sort((a, b) => b.correlation - a.correlation)

  loading.value = false
}
</script>

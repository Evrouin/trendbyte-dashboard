<template>
  <div>
    <h1 class="mb-2 text-3xl font-extrabold">Watchlist</h1>
    <p class="text-text-secondary mb-6">Track technologies you care about.</p>

    <div class="relative mb-6 max-w-md">
      <input
        v-model="query"
        type="text"
        placeholder="Add a technology..."
        class="border-border bg-surface text-text focus:border-accent w-full rounded-lg border px-4 py-2 text-sm outline-none"
        @focus="showSuggestions = true"
        @input="showSuggestions = true"
        @blur="hideSuggestions"
      />
      <div
        v-if="showSuggestions && suggestions.length"
        class="border-border bg-bg absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border shadow-lg"
      >
        <button
          v-for="s in suggestions"
          :key="s"
          class="text-text-secondary hover:bg-surface-hover hover:text-text w-full px-4 py-2 text-left text-sm transition"
          @click="addTech(s)"
        >
          <TechIcon :name="s" size="sm" /> {{ s }}
        </button>
      </div>
    </div>

    <ClientOnly>
      <div
        v-if="watchlist.list.value.length"
        class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="name in watchlist.list.value"
          :key="name"
          class="border-border bg-surface relative rounded-lg border p-4"
        >
          <button
            class="text-text-muted hover:text-red absolute top-3 right-3 text-lg"
            @click="watchlist.remove(name)"
          >
            ×
          </button>
          <div class="mb-2 flex items-center gap-2">
            <TechIcon :name="name" size="md" />
            <span class="font-bold">{{ name }}</span>
          </div>
          <WatchlistCard :name="name" />
        </div>
      </div>
      <div v-else class="border-border bg-surface rounded-lg border p-8 text-center">
        <p class="text-text-secondary">Add technologies to your watchlist to track them here.</p>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Watchlist — TrendByte' })

const store = useTrendsStore()
await store.fetchTrends(30, 20)

const watchlist = useWatchlist()
const query = ref('')
const showSuggestions = ref(false)

const suggestions = computed(() => {
  if (!query.value) return []
  const q = query.value.toLowerCase()
  return store.trends
    .map((t) => t.name)
    .filter((n) => n.toLowerCase().includes(q) && !watchlist.has(n))
    .slice(0, 8)
})

const hideSuggestions = () => {
  setTimeout(() => (showSuggestions.value = false), 200)
}

const addTech = (name: string) => {
  watchlist.add(name)
  query.value = ''
  showSuggestions.value = false
}
</script>

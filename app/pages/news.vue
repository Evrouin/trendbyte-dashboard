<template>
  <div>
    <h1 class="mb-2 text-3xl font-extrabold">Latest News</h1>
    <p class="text-text-secondary mb-6">Recent posts and articles from developer communities.</p>

    <div class="mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search by name, source, keyword..."
        class="border-border bg-surface text-text focus:border-accent w-full rounded-lg border px-4 py-2 text-sm outline-none"
      />
    </div>

    <div class="mb-6 flex flex-wrap gap-2">
      <button
        v-for="s in sources"
        :key="s"
        class="rounded-lg border px-3 py-1.5 text-xs font-medium transition"
        :class="
          activeSource === s
            ? 'border-accent bg-accent/20 text-accent'
            : 'border-border text-text-secondary hover:border-accent hover:text-accent'
        "
        @click="filterBySource(s)"
      >
        {{ s === 'all' ? 'All' : s }}
      </button>
    </div>

    <ErrorState v-if="error" message="Failed to load news" :retry="true" @retry="refresh" />

    <div v-if="filteredNews.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <a
        v-for="item in filteredNews"
        :key="item.url + item.collected_at"
        :href="item.url"
        target="_blank"
        class="glass-card hover:bg-surface-hover flex flex-col justify-between p-5 transition"
      >
        <div>
          <p class="line-clamp-3 leading-snug font-medium">{{ item.description }}</p>
        </div>
        <div class="text-text-muted mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span class="border-border-subtle rounded border px-1.5 py-0.5">{{ item.source }}</span>
          <span v-if="item.name" class="text-accent">{{ item.name }}</span>
          <span v-if="item.stars" class="ml-auto">{{ item.stars }} pts</span>
        </div>
        <p class="text-text-muted mt-2 text-xs">{{ formatDate(item.collected_at) }}</p>
      </a>
    </div>

    <div v-if="filteredNews.length >= pageSize" class="mt-6 text-center">
      <button
        class="border-border text-text-secondary hover:border-accent hover:text-accent rounded-lg border px-4 py-2 text-sm transition"
        @click="loadMore"
      >
        Load more
      </button>
    </div>

    <div v-if="!filteredNews.length && !pending && news?.news" class="glass-card p-8 text-center">
      <p class="text-text-secondary">No news found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'News — TrendByte' })

import { useTrendsStore } from '~/stores/trends'

const store = useTrendsStore()
await store.fetchStats()
await store.fetchNews()

const activeSource = ref('all')
const search = ref('')
const sources = computed(() => ['all', ...(store.stats?.active_sources || []).sort()])
const pending = ref(false)
const error = ref(false)

const pageSize = 30

const filteredNews = computed(() => {
  let items = store.news
  if (activeSource.value !== 'all') {
    items = items.filter((n) => n.source === activeSource.value)
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    items = items.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q),
    )
  }
  return items
})

const filterBySource = (source: string) => {
  activeSource.value = source
}

const loadMore = async () => {
  const currentCount = store.news.length
  store.lastFetched = {}
  await store.fetchNews({ limit: currentCount + pageSize })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

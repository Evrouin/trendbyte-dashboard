<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-extrabold">Latest News</h1>
        <p class="text-text-secondary mt-1">
          Recent posts and articles from developer communities.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="Search..."
          class="border-border bg-surface text-text focus:border-accent w-full rounded-lg border px-4 py-2 text-sm outline-none md:w-48"
        />
        <div class="relative md:hidden">
          <button
            class="border-border bg-surface text-text hover:border-accent flex items-center gap-2 rounded-lg border px-3 py-2 text-sm whitespace-nowrap transition outline-none"
            @click="sourceDropdownOpen = !sourceDropdownOpen"
          >
            {{ activeSource === 'all' ? 'All sources' : activeSource }}
            <svg
              class="h-3 w-3 transition"
              :class="{ 'rotate-180': sourceDropdownOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            v-if="sourceDropdownOpen"
            class="glass-card border-border absolute top-full right-0 z-40 mt-1 max-h-60 w-44 overflow-y-auto border shadow-lg"
          >
            <button
              v-for="s in sources"
              :key="s"
              class="w-full px-3 py-2 text-left text-sm transition"
              :class="
                activeSource === s
                  ? 'text-accent bg-accent/10'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text'
              "
              @click="selectSource(s)"
            >
              {{ s === 'all' ? 'All sources' : s }}
            </button>
          </div>
        </div>
        <DateRangePicker v-model="dateRange" />
      </div>
    </div>

    <div class="mb-6 hidden flex-wrap gap-2 md:flex">
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

    <ErrorState v-if="error" message="Failed to load news" />

    <div v-if="filteredNews.length" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <a
        v-for="(item, i) in filteredNews"
        :key="i"
        :href="item.url"
        target="_blank"
        class="glass-card hover:bg-surface-hover flex min-w-0 flex-col justify-between overflow-hidden p-5 transition"
      >
        <div>
          <p class="line-clamp-3 leading-snug font-medium">{{ item.description || item.url }}</p>
        </div>
        <div class="text-text-muted mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span class="border-border-subtle rounded border px-1.5 py-0.5">{{ item.source }}</span>
          <span v-if="item.name" class="text-accent"
            ><TechIcon :name="item.name" size="sm" /> {{ item.name }}</span
          >
          <span v-if="item.stars" class="ml-auto">{{ item.stars }} pts</span>
        </div>
        <p class="text-text-muted mt-2 text-xs">{{ formatDate(item.collected_at) }}</p>
      </a>
    </div>

    <div
      v-if="store.news.length >= pageSize && store.news.length % pageSize === 0"
      class="mt-6 text-center"
    >
      <button
        class="border-border text-text-secondary hover:border-accent hover:text-accent rounded-lg border px-4 py-2 text-sm transition"
        @click="loadMore"
      >
        Load more
      </button>
    </div>

    <div v-if="!filteredNews.length && !pending" class="glass-card p-8 text-center">
      <p class="text-text-secondary">No news found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'News — TrendByte' })

import { useTrendsStore } from '~/stores/trends'

const store = useTrendsStore()
await store.fetchStats()
await store.fetchNews({ limit: 30, from_date: toDateStr(sevenDaysAgo), to_date: toDateStr(today) })

const activeSource = ref('all')
const search = ref('')
const today = new Date()
const sevenDaysAgo = new Date(today.getTime() - 7 * 86400000)
const toDateStr = (d: Date) => d.toISOString().slice(0, 10)
const dateRange = ref({ from: toDateStr(sevenDaysAgo), to: toDateStr(today) })
const sourceDropdownOpen = ref(false)
const sources = computed(() => ['all', ...(store.stats?.active_sources || []).sort()])
const pending = ref(false)
const error = ref(false)

const pageSize = 30

watch(
  dateRange,
  async (val) => {
    const params: Record<string, string | number> = { limit: pageSize }
    if (val.from) params.from_date = val.from
    if (val.to) params.to_date = val.to
    store.lastFetched = {}
    await store.fetchNews(params)
  },
  { deep: true },
)

const filteredNews = computed(() => {
  let items = store.news
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

const filterBySource = async (source: string) => {
  activeSource.value = source
  const params: Record<string, string | number> = { limit: pageSize }
  if (source !== 'all') params.source = source
  if (dateRange.value.from) params.from_date = dateRange.value.from
  if (dateRange.value.to) params.to_date = dateRange.value.to
  store.lastFetched = {}
  await store.fetchNews(params)
}

const selectSource = (source: string) => {
  filterBySource(source)
  sourceDropdownOpen.value = false
}

const loadMore = async () => {
  const currentCount = store.news.length
  const params: Record<string, string | number> = { limit: currentCount + pageSize }
  if (activeSource.value !== 'all') params.source = activeSource.value
  if (dateRange.value.from) params.from_date = dateRange.value.from
  if (dateRange.value.to) params.to_date = dateRange.value.to
  store.lastFetched = {}
  await store.fetchNews(params)
}

const formatDate = (date: string) => {
  const d = new Date(date)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`
}
</script>

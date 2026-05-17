<template>
  <div>
    <h1 class="mb-2 text-3xl font-extrabold">Latest News</h1>
    <p class="text-text-secondary mb-6">Recent posts and articles from developer communities.</p>

    <div class="mb-6 flex gap-2">
      <button
        v-for="s in ['all', 'github', 'hackernews', 'devto', 'lobsters']"
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

    <ErrorState v-else-if="error" message="Failed to load news" :retry="true" @retry="refresh" />

    <div
      v-else-if="news?.news?.length"
      class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <a
        v-for="item in news.news"
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

    <div v-else class="glass-card p-8 text-center">
      <p class="text-text-secondary">No news yet. Data appears after pipeline runs.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'News — TrendByte' })
const { fetchNews } = useApi()

const activeSource = ref('all')
const {
  data: news,
  pending,
  error,
  refresh,
} = useFetch<{
  news: {
    source: string
    name: string
    url: string
    description: string
    stars: number
    collected_at: string
  }[]
  count: number
}>(`${useRuntimeConfig().public.apiUrl}/api/news`, { params: { limit: 30 }, lazy: true })

const filterBySource = async (source: string) => {
  activeSource.value = source
  const params = source === 'all' ? { limit: 30 } : { source, limit: 30 }
  const { data } = await fetchNews(params)
  if (data.value) {
    news.value = data.value
  }
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

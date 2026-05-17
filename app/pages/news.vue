<template>
  <div>
    <h1 class="mb-2 text-3xl font-extrabold">Latest News</h1>
    <p class="mb-6 text-text-secondary">Recent posts and articles from developer communities.</p>

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

    <SkeletonLoader v-if="pending" />
    <ErrorState v-else-if="error" message="Failed to load news" :retry="true" @retry="refresh" />

    <div v-else-if="news?.news?.length" class="grid gap-3">
      <a
        v-for="item in news.news"
        :key="item.url + item.collected_at"
        :href="item.url"
        target="_blank"
        class="glass-card flex items-start gap-4 px-5 py-4 transition hover:bg-surface-hover"
      >
        <div class="flex-1">
          <p class="font-medium leading-snug">{{ item.description }}</p>
          <div class="mt-2 flex items-center gap-3 text-xs text-text-muted">
            <span class="rounded border border-border-subtle px-1.5 py-0.5">{{ item.source }}</span>
            <span v-if="item.name" class="text-accent">{{ item.name }}</span>
            <span v-if="item.stars">{{ item.stars }} points</span>
            <span>{{ formatDate(item.collected_at) }}</span>
          </div>
        </div>
        <span class="shrink-0 text-xs text-text-muted">&nearr;</span>
      </a>
    </div>

    <div v-else class="glass-card p-8 text-center">
      <p class="text-text-secondary">No news yet. Data appears after pipeline runs.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { fetchNews } = useApi()

const activeSource = ref('all')
const { data: news, pending, error, refresh } = await fetchNews({ limit: 30 })

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

<template>
  <div v-if="data?.trend">
    <div class="mb-4 flex items-center justify-between">
      <NuxtLink to="/trends" class="text-text-secondary hover:text-accent text-sm transition">
        &larr; Back to trends
      </NuxtLink>
      <button class="text-text-secondary hover:text-accent text-sm transition" @click="share">
        📋 Share
      </button>
    </div>

    <h1 class="mb-2 text-3xl font-extrabold">{{ data.trend.name }}</h1>
    <div class="text-text-secondary mb-8 flex gap-4 text-sm">
      <span>Score: {{ Math.round(data.trend.score).toLocaleString() }}</span>
      <span>Sources: {{ data.trend.sources.join(', ') }}</span>
    </div>

    <div class="mb-10 grid gap-6 lg:grid-cols-3">
      <section
        v-if="data.history.length"
        class="glass-card p-6 lg:col-span-2"
        style="height: 300px"
      >
        <ClientOnly>
          <LineChart
            :labels="data.history.map((h) => new Date(h.calculated_at).toLocaleDateString())"
            :values="data.history.map((h) => Math.round(h.score))"
            title="Score Over Time"
          />
        </ClientOnly>
      </section>

      <section v-if="sourceBreakdown.labels.length" class="glass-card p-6" style="height: 300px">
        <h3 class="text-text-secondary mb-2 text-xs font-semibold uppercase">Source Breakdown</h3>
        <ClientOnly>
          <PieChart :labels="sourceBreakdown.labels" :values="sourceBreakdown.values" />
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
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchTrendDetail } = useApi()
const { show: showToast } = useToast()

const { data } = await fetchTrendDetail(route.params.name as string)

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

const share = async () => {
  await navigator.clipboard.writeText(window.location.href)
  showToast('Link copied to clipboard')
}
</script>

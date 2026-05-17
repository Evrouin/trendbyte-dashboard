<template>
  <div v-if="data?.trend">
    <NuxtLink to="/trends" class="mb-4 inline-block text-sm text-text-secondary transition hover:text-accent">
      &larr; Back to trends
    </NuxtLink>
    <h1 class="mb-2 text-3xl font-extrabold">{{ data.trend.name }}</h1>
    <div class="mb-8 flex gap-4 text-sm text-text-secondary">
      <span>Score: {{ Math.round(data.trend.score).toLocaleString() }}</span>
      <span>Sources: {{ data.trend.sources.join(', ') }}</span>
    </div>

    <section v-if="data.history.length" class="mb-10 glass-card p-6" style="height: 300px">
      <ClientOnly>
        <LineChart
          :labels="data.history.map((h) => new Date(h.calculated_at).toLocaleDateString())"
          :values="data.history.map((h) => Math.round(h.score))"
          title="Score Over Time"
        />
      </ClientOnly>
    </section>

    <section v-if="data.posts?.length">
      <h2 class="mb-4 text-xl font-bold">Related Posts</h2>
      <div class="grid gap-3">
        <a
          v-for="post in data.posts"
          :key="post.url"
          :href="post.url"
          target="_blank"
          class="glass-card flex items-start gap-4 px-5 py-4 transition hover:bg-surface-hover"
        >
          <div class="flex-1">
            <p class="font-medium leading-snug">{{ post.description }}</p>
            <div class="mt-2 flex items-center gap-3 text-xs text-text-muted">
              <span class="rounded border border-border-subtle px-1.5 py-0.5">{{ post.source }}</span>
              <span v-if="post.stars">{{ post.stars }} points</span>
              <span>{{ new Date(post.collected_at).toLocaleDateString() }}</span>
            </div>
          </div>
          <span class="text-text-muted text-xs shrink-0">&nearr;</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchTrendDetail } = useApi()

const { data } = await fetchTrendDetail(route.params.name as string)
</script>

<template>
  <div v-if="data?.trend">
    <NuxtLink
      to="/trends"
      class="text-text-secondary hover:text-accent mb-4 inline-block text-sm transition"
    >
      &larr; Back to trends
    </NuxtLink>
    <h1 class="mb-2 text-3xl font-extrabold">{{ data.trend.name }}</h1>
    <div class="text-text-secondary mb-8 flex gap-4 text-sm">
      <span>Score: {{ Math.round(data.trend.score).toLocaleString() }}</span>
      <span>Sources: {{ data.trend.sources.join(', ') }}</span>
    </div>

    <section v-if="data.history.length" class="glass-card mb-10 p-6" style="height: 300px">
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

const { data } = await fetchTrendDetail(route.params.name as string)
</script>

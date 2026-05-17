<template>
  <div v-if="data?.trend">
    <NuxtLink to="/trends" class="mb-4 inline-block text-sm text-text-secondary transition hover:text-accent">
      &larr; Back to trends
    </NuxtLink>
    <h1 class="mb-2 text-3xl font-extrabold">{{ data.trend.name }}</h1>
    <div class="mb-8 flex gap-4 text-sm text-text-secondary">
      <span>Score: {{ Math.round(data.trend.score).toLocaleString() }}</span>
      <span>Sources: {{ data.trend.sources.join(', ') }}</span>
      <a
        v-if="data.trend.top_url"
        :href="data.trend.top_url"
        target="_blank"
        class="text-accent transition hover:underline"
      >
        View source
      </a>
    </div>

    <section v-if="data.history.length" class="glass-card p-6" style="height: 350px">
      <ClientOnly>
        <LineChart
          :labels="data.history.map((h) => new Date(h.calculated_at).toLocaleDateString())"
          :values="data.history.map((h) => Math.round(h.score))"
          title="Score Over Time"
        />
      </ClientOnly>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchTrendDetail } = useApi()

const { data } = await fetchTrendDetail(route.params.name as string)
</script>

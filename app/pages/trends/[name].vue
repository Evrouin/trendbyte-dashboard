<template>
  <div v-if="data?.trend">
    <NuxtLink to="/trends" class="mb-4 inline-block text-sm text-text-secondary transition hover:text-accent">
      &larr; Back to trends
    </NuxtLink>
    <h1 class="mb-2 text-3xl font-extrabold text-text">{{ data.trend.name }}</h1>
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

    <section v-if="data.history.length" class="glass-card p-8">
      <h2 class="mb-6 text-lg font-bold text-text">Score History</h2>
      <div class="flex items-end gap-1.5" style="height: 200px">
        <div
          v-for="(point, i) in data.history"
          :key="i"
          class="flex-1 rounded-t-md bg-accent/70 transition-all hover:bg-accent"
          :style="{ height: `${(point.score / maxScore) * 100}%` }"
          :title="`${Math.round(point.score)} — ${new Date(point.calculated_at).toLocaleDateString()}`"
        />
      </div>
      <div class="mt-3 flex justify-between text-xs text-text-muted">
        <span>{{ new Date(data.history[0].calculated_at).toLocaleDateString() }}</span>
        <span>{{ new Date(data.history[data.history.length - 1].calculated_at).toLocaleDateString() }}</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchTrendDetail } = useApi()

const { data } = await fetchTrendDetail(route.params.name as string)

const maxScore = computed(() => {
  if (!data.value?.history.length) return 1
  return Math.max(...data.value.history.map((h) => h.score))
})
</script>

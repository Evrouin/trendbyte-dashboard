<template>
  <div>
    <h1 class="mb-6 text-3xl font-extrabold">Categories</h1>

    <ErrorState
      v-else-if="error"
      message="Failed to load categories"
      :retry="true"
      @retry="refresh"
    />

    <div v-else-if="data?.categories" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="cat in data.categories" :key="cat.category" class="glass-card p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-bold capitalize">{{ cat.category }}</h3>
          <span
            class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            :class="categoryColor(cat.category)"
          >
            {{ cat.trends.length }} trending
          </span>
        </div>

        <div v-if="cat.trends.length" class="glass-card mb-4 p-4" style="height: 180px">
          <ClientOnly>
            <BarChart
              :labels="cat.trends.map((t) => t.name)"
              :values="cat.trends.map((t) => Math.round(t.score))"
            />
          </ClientOnly>
        </div>

        <div v-if="cat.trends.length" class="space-y-2">
          <div
            v-for="(t, i) in cat.trends"
            :key="t.name"
            class="border-border-subtle flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
          >
            <div class="flex items-center gap-2">
              <span class="text-text-muted">{{ i + 1 }}.</span>
              <NuxtLink :to="`/trends/${t.name}`" class="text-accent hover:underline">
                {{ t.name }}
              </NuxtLink>
            </div>
            <span class="text-text-secondary">{{ Math.round(t.score).toLocaleString() }}</span>
          </div>
        </div>
        <p v-else class="text-text-muted text-sm">No trending data yet</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Categories — TrendByte' })
const { fetchTrendsByCategory } = useApi()
const { data, pending, error, refresh } = useFetch<{
  categories: { category: string; trends: { name: string; mentions: number; score: number }[] }[]
}>(`${useRuntimeConfig().public.apiUrl}/api/trends/by-category`, {
  params: { days: 7, limit: 5 },
  lazy: true,
})

const categoryColor = (cat: string) => {
  const colors: Record<string, string> = {
    ai: 'bg-purple/20 text-purple',
    web: 'bg-accent/20 text-accent',
    devops: 'bg-success/20 text-success',
    languages: 'bg-warning/20 text-warning',
    databases: 'bg-yellow/20 text-yellow',
    security: 'bg-red/20 text-red',
  }
  return colors[cat] || 'bg-accent/20 text-accent'
}
</script>

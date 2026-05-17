<template>
  <div>
    <h1 class="mb-6 text-3xl font-extrabold text-text">Categories</h1>
    <div v-if="categories?.categories" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="cat in categories.categories" :key="cat.name" class="glass-card p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-bold capitalize text-text">{{ cat.name }}</h3>
          <span class="text-xs text-text-muted">{{ cat.keyword_count }} keywords</span>
        </div>
        <div v-if="cat.top_trends.length" class="space-y-2">
          <div
            v-for="t in cat.top_trends"
            :key="t.name"
            class="flex items-center justify-between rounded-lg border border-border-subtle px-3 py-2 text-sm"
          >
            <span class="text-text">{{ t.name }}</span>
            <span class="text-text-secondary">{{ Math.round(t.score).toLocaleString() }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-text-muted">No trending data yet</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { fetchCategories } = useApi()
const { data: categories } = await fetchCategories()
</script>

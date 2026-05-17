<template>
  <div>
    <h1 class="mb-6 text-3xl font-bold">Categories</h1>
    <div v-if="categories?.categories" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="cat in categories.categories"
        :key="cat.name"
        class="rounded-xl border border-border bg-surface p-5"
      >
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-lg font-semibold capitalize">{{ cat.name }}</h3>
          <span class="text-xs text-muted">{{ cat.keyword_count }} keywords</span>
        </div>
        <div v-if="cat.top_trends.length" class="space-y-2">
          <div
            v-for="t in cat.top_trends"
            :key="t.name"
            class="flex items-center justify-between text-sm"
          >
            <span>{{ t.name }}</span>
            <span class="text-muted">{{ Math.round(t.score).toLocaleString() }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-muted">No trending data yet</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { fetchCategories } = useApi()
const { data: categories } = await fetchCategories()
</script>

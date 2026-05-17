<template>
  <div>
    <h1 class="mb-6 text-3xl font-bold">Trends</h1>
    <div v-if="trends?.trends" class="overflow-hidden rounded-xl border border-border bg-surface">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-border text-muted">
          <tr>
            <th class="px-4 py-3">#</th>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Mentions</th>
            <th class="px-4 py-3">Score</th>
            <th class="px-4 py-3">Growth</th>
            <th class="px-4 py-3">Sources</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(trend, i) in trends.trends"
            :key="trend.name"
            class="border-b border-border last:border-0"
          >
            <td class="px-4 py-3 text-muted">{{ i + 1 }}</td>
            <td class="px-4 py-3 font-medium">
              <NuxtLink :to="`/trends/${trend.name}`" class="text-accent hover:underline">
                {{ trend.name }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3">{{ trend.mentions }}</td>
            <td class="px-4 py-3">{{ Math.round(trend.score).toLocaleString() }}</td>
            <td class="px-4 py-3">
              <span :class="trend.growth_pct >= 0 ? 'text-success' : 'text-warning'">
                {{ trend.growth_pct >= 0 ? '+' : '' }}{{ trend.growth_pct.toFixed(1) }}%
              </span>
            </td>
            <td class="px-4 py-3 text-muted">{{ trend.sources.join(', ') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const { fetchTrends } = useApi()
const { data: trends } = await fetchTrends({ days: 7, limit: 20 })
</script>

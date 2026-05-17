<template>
  <div>
    <h1 class="mb-6 text-3xl font-extrabold text-text">Trends</h1>
    <div v-if="trends?.trends" class="glass-card overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-border text-text-secondary">
          <tr>
            <th class="px-5 py-3 font-semibold">#</th>
            <th class="px-5 py-3 font-semibold">Name</th>
            <th class="px-5 py-3 font-semibold">Mentions</th>
            <th class="px-5 py-3 font-semibold">Score</th>
            <th class="px-5 py-3 font-semibold">Growth</th>
            <th class="px-5 py-3 font-semibold">Sources</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(trend, i) in trends.trends"
            :key="trend.name"
            class="border-b border-border-subtle last:border-0 transition hover:bg-surface-hover"
          >
            <td class="px-5 py-3 text-text-secondary">{{ i + 1 }}</td>
            <td class="px-5 py-3 font-bold">
              <NuxtLink :to="`/trends/${trend.name}`" class="text-accent hover:underline">
                {{ trend.name }}
              </NuxtLink>
            </td>
            <td class="px-5 py-3 text-text">{{ trend.mentions }}</td>
            <td class="px-5 py-3 text-text">{{ Math.round(trend.score).toLocaleString() }}</td>
            <td class="px-5 py-3">
              <span
                class="rounded-full px-2 py-0.5 text-xs font-semibold"
                :class="
                  trend.growth_pct >= 0
                    ? 'bg-success/20 text-success'
                    : 'bg-warning/20 text-warning'
                "
              >
                {{ trend.growth_pct >= 0 ? '+' : '' }}{{ trend.growth_pct.toFixed(1) }}%
              </span>
            </td>
            <td class="px-5 py-3 text-text-secondary">{{ trend.sources.join(', ') }}</td>
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

<template>
  <div>
    <h1 class="mb-6 text-3xl font-extrabold">Trends</h1>

    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <input
        v-model="search"
        type="text"
        placeholder="Search trends..."
        class="border-border bg-surface text-text placeholder-text-muted focus:border-accent w-full rounded-lg border px-4 py-2 text-sm outline-none md:w-64"
      />
      <select
        v-model="selectedDays"
        class="border-border bg-surface text-text focus:border-accent rounded-lg border px-4 py-2 text-sm outline-none"
        @change="refresh()"
      >
        <option :value="7">Last 7 days</option>
        <option :value="14">Last 14 days</option>
        <option :value="30">Last 30 days</option>
      </select>
    </div>

    <ErrorState v-if="error" message="Failed to load trends" :retry="true" @retry="refresh" />

    <div v-else-if="filteredTrends.length" class="glass-card overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="border-border text-text-secondary border-b">
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
            v-for="(trend, i) in filteredTrends"
            :key="trend.name"
            class="border-border-subtle hover:bg-surface-hover border-b transition last:border-0"
          >
            <td class="text-text-secondary px-5 py-3">{{ i + 1 }}</td>
            <td class="px-5 py-3 font-bold">
              <NuxtLink :to="`/trends/${trend.name}`" class="text-accent hover:underline">
                {{ trend.name }}
              </NuxtLink>
            </td>
            <td class="px-5 py-3">{{ trend.mentions }}</td>
            <td class="px-5 py-3">{{ Math.round(trend.score).toLocaleString() }}</td>
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
            <td class="text-text-secondary px-5 py-3">{{ trend.sources.join(', ') }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="glass-card p-8 text-center">
      <p class="text-text-secondary">No trends found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Trends — TrendByte' })

const { fetchTrends } = useApi()

const search = ref('')
const selectedDays = ref(7)

const {
  data: trends,
  pending,
  error,
  refresh,
} = useFetch<{ trends: import('~/types').Trend[]; count: number }>(
  `${useRuntimeConfig().public.apiUrl}/api/trends`,
  { params: { days: selectedDays.value, limit: 30 }, lazy: true },
)

const filteredTrends = computed(() => {
  if (!trends.value?.trends) return []
  if (!search.value) return trends.value.trends
  const q = search.value.toLowerCase()
  return trends.value.trends.filter((t) => t.name.toLowerCase().includes(q))
})
</script>

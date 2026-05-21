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
      <div class="flex items-center gap-3">
        <div class="relative">
          <button
            class="border-border bg-surface text-text flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
            @click="dropdownOpen = !dropdownOpen"
          >
            Last {{ selectedDays }} days
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="transition"
              :class="{ 'rotate-180': dropdownOpen }"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div
            v-if="dropdownOpen"
            class="border-border bg-bg-secondary absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-lg border shadow-lg"
          >
            <button
              v-for="opt in [7, 14, 30]"
              :key="opt"
              class="hover:bg-surface-hover w-full px-4 py-2 text-left text-sm transition"
              :class="selectedDays === opt ? 'text-accent' : 'text-text'"
              @click="selectDays(opt)"
            >
              Last {{ opt }} days
            </button>
          </div>
        </div>
        <button
          class="text-text-muted hover:text-accent text-xs transition"
          title="Export CSV"
          @click="exportCsv"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    </div>

    <ErrorState v-if="error" message="Failed to load trends" :retry="true" @retry="refresh" />

    <div v-else-if="filteredTrends.length" class="glass-card overflow-hidden">
      <table class="hidden w-full text-left text-sm md:table">
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

      <div class="grid gap-3 p-4 md:hidden">
        <NuxtLink
          v-for="(trend, i) in filteredTrends"
          :key="trend.name"
          :to="`/trends/${trend.name}`"
          class="glass-card flex items-center justify-between p-4"
        >
          <div>
            <p class="text-accent font-bold">{{ i + 1 }}. {{ trend.name }}</p>
            <p class="text-text-secondary text-xs">
              {{ trend.mentions }} mentions · {{ trend.sources.join(', ') }}
            </p>
          </div>
          <div class="text-right">
            <p class="font-semibold">{{ Math.round(trend.score).toLocaleString() }}</p>
            <span
              class="rounded-full px-2 py-0.5 text-xs font-semibold"
              :class="
                trend.growth_pct >= 0 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
              "
            >
              {{ trend.growth_pct >= 0 ? '+' : '' }}{{ trend.growth_pct.toFixed(1) }}%
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="glass-card p-8 text-center">
      <p class="text-text-secondary">No trends found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Trends — TrendByte' })

const search = ref('')
const selectedDays = ref(30)
const dropdownOpen = ref(false)

const selectDays = (days: number) => {
  selectedDays.value = days
  dropdownOpen.value = false
}

const {
  data: trends,
  pending,
  error,
  refresh,
} = useFetch<{ trends: import('~/types').Trend[]; count: number }>(
  `${useRuntimeConfig().public.apiUrl}/api/trends`,
  { params: computed(() => ({ days: selectedDays.value, limit: 30 })), lazy: true },
)

const filteredTrends = computed(() => {
  if (!trends.value?.trends) return []
  if (!search.value) return trends.value.trends
  const q = search.value.toLowerCase()
  return trends.value.trends.filter((t) => t.name.toLowerCase().includes(q))
})

const exportCsv = () => {
  if (!filteredTrends.value.length) return
  const header = 'Name,Mentions,Score,Growth %,Sources'
  const rows = filteredTrends.value.map(
    (t) =>
      `${t.name},${t.mentions},${Math.round(t.score)},${t.growth_pct.toFixed(1)},"${t.sources.join(', ')}"`,
  )
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `trendbyte-trends-${selectedDays.value}d.csv`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
      e.preventDefault()
      document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')?.focus()
    }
  })
})
</script>

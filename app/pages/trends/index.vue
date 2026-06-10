<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 class="text-3xl font-extrabold">Trends</h1>
      <div class="flex items-center gap-3">
        <div class="tooltip min-w-0 flex-1 md:flex-none" data-tooltip="Press '/' to focus">
          <input
            v-model="search"
            type="text"
            placeholder="Search trends..."
            class="border-border bg-surface text-text placeholder-text-muted focus:border-accent w-full rounded-lg border px-4 py-2 text-sm outline-none"
          />
        </div>
        <div class="flex shrink-0 items-center gap-2">
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
        </div>
      </div>
    </div>

    <ErrorState v-if="error" message="Failed to load trends" :retry="true" @retry="refresh" />

    <div v-else-if="filteredTrends.length" class="glass-card overflow-hidden">
      <table class="hidden w-full text-left text-sm md:table">
        <thead class="border-border text-text-secondary border-b">
          <tr>
            <th class="px-5 py-3"></th>
            <th class="px-5 py-3 font-semibold">Name</th>
            <th
              class="cursor-pointer px-5 py-3 font-semibold select-none"
              @click="toggleSort('mentions')"
            >
              Mentions
              <span v-if="sortKey === 'mentions'" class="text-accent">{{
                sortDir === 'asc' ? '↑' : '↓'
              }}</span>
            </th>
            <th
              class="cursor-pointer px-5 py-3 font-semibold select-none"
              @click="toggleSort('score')"
            >
              Score
              <span v-if="sortKey === 'score'" class="text-accent">{{
                sortDir === 'asc' ? '↑' : '↓'
              }}</span>
            </th>
            <th
              class="cursor-pointer px-5 py-3 font-semibold select-none"
              @click="toggleSort('growth_pct')"
            >
              Growth
              <span v-if="sortKey === 'growth_pct'" class="text-accent">{{
                sortDir === 'asc' ? '↑' : '↓'
              }}</span>
            </th>
            <th class="px-5 py-3 font-semibold">Sources</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(trend, i) in filteredTrends"
            :key="trend.name"
            class="border-border-subtle hover:bg-surface-hover border-b transition last:border-0"
          >
            <td class="px-5 py-3">
              <span
                class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                :class="
                  scoreRanks[trend.name] === 0
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : scoreRanks[trend.name] === 1
                      ? 'bg-gray-300/20 text-gray-300'
                      : scoreRanks[trend.name] === 2
                        ? 'bg-orange-400/20 text-orange-400'
                        : 'bg-surface-hover text-text-muted'
                "
                >{{ (scoreRanks[trend.name] ?? i) + 1 }}</span
              >
            </td>
            <td class="px-5 py-3 font-bold">
              <NuxtLink
                :to="trendPath(trend.name)"
                class="text-accent flex items-center gap-2 hover:underline"
              >
                <TechIcon :name="trend.name" size="sm" />
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
          :to="trendPath(trend.name)"
          class="glass-card flex items-center justify-between p-4"
        >
          <div class="flex items-center gap-3">
            <span
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              :class="
                scoreRanks[trend.name] === 0
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : scoreRanks[trend.name] === 1
                    ? 'bg-gray-300/20 text-gray-300'
                    : scoreRanks[trend.name] === 2
                      ? 'bg-orange-400/20 text-orange-400'
                      : 'bg-surface-hover text-text-muted'
              "
              >{{ (scoreRanks[trend.name] ?? i) + 1 }}</span
            >
            <div>
              <p class="text-accent flex items-center gap-1.5 font-bold">
                <TechIcon :name="trend.name" size="sm" /> {{ trend.name }}
              </p>
              <p class="text-text-secondary text-xs">
                {{ trend.mentions }} mentions · {{ trend.sources.join(', ') }}
              </p>
            </div>
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

const store = useTrendsStore()

const search = ref('')
const selectedDays = ref(7)
const dropdownOpen = ref(false)

const selectDays = (days: number) => {
  selectedDays.value = days
  dropdownOpen.value = false
}

const {
  data: trends,
  error,
  refresh,
} = useFetch<{ trends: import('~/types').Trend[]; count: number }>(
  `${useRuntimeConfig().public.apiUrl}/api/trends`,
  { params: computed(() => ({ days: selectedDays.value, limit: 30 })), lazy: true },
)

const sortKey = ref<string>('')
const sortDir = ref<'asc' | 'desc'>('desc')

const toggleSort = (key: string) => {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortKey.value = key
    sortDir.value = 'desc'
  }
}

const filteredTrends = computed(() => {
  if (!trends.value?.trends) return []
  let items = trends.value.trends
  if (search.value) {
    const q = search.value.toLowerCase()
    items = items.filter((t) => t.name.toLowerCase().includes(q))
  }
  if (sortKey.value) {
    const dir = sortDir.value === 'asc' ? 1 : -1
    items = [...items].sort((a: any, b: any) => (a[sortKey.value] - b[sortKey.value]) * dir)
  }
  return items
})

const scoreRanks = computed(() => {
  if (!trends.value?.trends) return {}
  const sorted = [...trends.value.trends].sort((a: any, b: any) => b.score - a.score)
  const ranks: Record<string, number> = {}
  sorted.forEach((t: any, idx: number) => {
    ranks[t.name] = idx
  })
  return ranks
})

onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
      e.preventDefault()
      document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')?.focus()
    }
  })
})
</script>

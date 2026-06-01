<template>
  <div v-if="data" class="text-sm">
    <div class="mb-1 flex flex-wrap gap-1">
      <TrendBadges
        :sources="data.trend.sources"
        :growth-pct="data.trend.growth_pct"
        :lifecycle="lifecycle"
      />
    </div>
    <p class="text-text-secondary">
      Score:
      <span class="text-text font-semibold">{{
        Math.round(data.trend.score).toLocaleString()
      }}</span>
      · {{ data.trend.mentions }} mentions
    </p>
  </div>
  <p v-else class="text-text-muted text-xs">Loading...</p>
</template>

<script setup lang="ts">
import type { TrendDetail } from '~/types'

const props = defineProps<{ name: string }>()
const config = useRuntimeConfig()
const baseUrl = config.public.apiUrl

const { data } = useAsyncData(`watchlist-${props.name}`, () =>
  fetchWithHmac<TrendDetail>(`${baseUrl}/api/trends/${props.name}`),
)

const lifecycle = computed(() => {
  if (!data.value) return ''
  const g = data.value.trend.growth_pct
  if (g > 10) return 'rising'
  if (g < -10) return 'declining'
  return 'stable'
})
</script>

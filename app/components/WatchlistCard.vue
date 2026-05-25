<template>
  <div v-if="data" class="text-sm">
    <p class="text-text-secondary">
      Score: <span class="text-text font-semibold">{{ Math.round(data.trend.score) }}</span>
    </p>
    <p class="text-text-secondary capitalize">
      Lifecycle: <span class="text-accent font-semibold">{{ lifecycle }}</span>
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

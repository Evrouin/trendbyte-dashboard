<template>
  <div>
    <h1 class="mb-2 text-3xl font-extrabold">Rising Stars</h1>
    <p class="text-text-secondary mb-8">
      Technologies showing early signs of trending, detected by our ML model.
    </p>

    <ErrorState v-if="error" message="Failed to load predictions" :retry="true" @retry="refresh" />

    <div v-else-if="highConfidence.length || moderate.length">
      <section v-if="highConfidence.length" class="mb-8">
        <h2 class="text-text-secondary mb-3 text-sm font-semibold uppercase">High Confidence</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NuxtLink
            v-for="p in highConfidence"
            :key="p.name"
            :to="trendPath(p.name)"
            class="glass-card hover:border-accent/30 flex items-start gap-4 p-5 transition"
          >
            <TechIcon :name="p.name" size="md" />
            <div class="min-w-0 flex-1">
              <p class="text-lg font-bold">{{ p.name }}</p>
              <div class="mt-1 flex flex-wrap gap-1.5">
                <span
                  v-for="signal in p.signals"
                  :key="signal"
                  class="border-border-subtle bg-surface-hover text-text-secondary rounded-md border px-2 py-0.5 text-xs"
                >
                  {{ formatSignal(signal) }}
                </span>
              </div>
              <p class="text-text-muted mt-2 text-xs">
                Spotted {{ formatRelative(p.predicted_at) }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <section v-if="moderate.length">
        <h2 class="text-text-secondary mb-3 text-sm font-semibold uppercase">Watch List</h2>
        <div class="glass-card overflow-hidden">
          <NuxtLink
            v-for="p in moderate"
            :key="p.name"
            :to="trendPath(p.name)"
            class="border-border hover:bg-surface-hover flex items-center gap-3 border-b px-5 py-3 transition last:border-0"
          >
            <TechIcon :name="p.name" size="sm" />
            <span class="font-medium">{{ p.name }}</span>
            <div class="flex flex-wrap gap-1">
              <span v-for="signal in p.signals" :key="signal" class="text-text-muted text-[10px]">
                {{ formatSignal(signal) }}
              </span>
            </div>
            <span class="text-text-muted ml-auto text-xs">{{
              formatRelative(p.predicted_at)
            }}</span>
          </NuxtLink>
        </div>
      </section>
    </div>

    <div v-else class="glass-card p-8 text-center">
      <p class="text-text-secondary">
        No rising stars detected yet. Data accumulates after multiple pipeline runs.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Rising Stars — TrendByte' })
import { formatSignal } from '~/utils/formatSignal'
import { useTrendsStore } from '~/stores/trends'

const store = useTrendsStore()
const error = ref(false)

try {
  await store.fetchPredictions(20)
} catch {
  error.value = true
}

const highConfidence = computed(() => store.predictions.filter((p) => p.confidence >= 0.6))
const moderate = computed(() => store.predictions.filter((p) => p.confidence < 0.6))

const refresh = async () => {
  error.value = false
  try {
    store.invalidate()
    await store.fetchPredictions(20)
  } catch {
    error.value = true
  }
}

const formatRelative = (date: string) => {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days}d ago`
}
</script>

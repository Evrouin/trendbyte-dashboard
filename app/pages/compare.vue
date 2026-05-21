<template>
  <div>
    <h1 class="mb-2 text-3xl font-extrabold">Compare Trends</h1>
    <p class="text-text-secondary mb-6">Select trends to compare their score history.</p>

    <div class="mb-6 flex flex-wrap gap-2">
      <button
        v-for="name in availableTrends"
        :key="name"
        class="rounded-lg border px-3 py-1.5 text-xs font-medium transition"
        :class="
          selected.includes(name)
            ? 'border-accent bg-accent/20 text-accent'
            : 'border-border text-text-secondary hover:border-accent hover:text-accent'
        "
        @click="toggle(name)"
      >
        {{ name }}
      </button>
    </div>

    <div v-if="datasets.length" class="glass-card p-6" style="height: 400px">
      <ClientOnly>
        <ComparisonChart :datasets="datasets" />
      </ClientOnly>
    </div>

    <div v-else class="glass-card p-8 text-center">
      <p class="text-text-secondary">Select up to 5 trends above to compare.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Compare — TrendByte' })

const config = useRuntimeConfig()
const baseUrl = config.public.apiUrl

const { data: trends } = useFetch<{ trends: { name: string }[] }>(`${baseUrl}/api/trends`, {
  params: { days: 30, limit: 20 },
  lazy: true,
})

const availableTrends = computed(() => trends.value?.trends.map((t) => t.name) || [])
const selected = ref<string[]>([])

const toggle = (name: string) => {
  if (selected.value.includes(name)) {
    selected.value = selected.value.filter((n) => n !== name)
  } else if (selected.value.length < 5) {
    selected.value = [...selected.value, name]
  }
}

const datasets = ref<{ name: string; labels: string[]; values: number[] }[]>([])

watch(
  selected,
  async (names) => {
    const results = await Promise.all(
      names.map(async (name) => {
        const data = await $fetch<{
          history: { score: number; calculated_at: string }[]
        }>(`${baseUrl}/api/trends/${name}`)
        const history = data?.history || []
        return {
          name,
          labels: history.map((h) =>
            new Date(h.calculated_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            }),
          ),
          values: history.map((h) => Math.round(h.score)),
        }
      }),
    )
    datasets.value = results
  },
  { deep: true },
)
</script>

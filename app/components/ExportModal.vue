<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="emit('update:modelValue', false)"
    >
      <div class="glass-card border-border w-full max-w-md border p-6 shadow-lg">
        <h2 class="mb-4 text-lg font-bold">Export Trends</h2>

        <div class="mb-4">
          <label class="text-text-secondary mb-1 block text-xs font-medium">Date Range</label>
          <DateRangePicker v-model="dateRange" />
        </div>

        <div class="mb-4">
          <label class="text-text-secondary mb-1 block text-xs font-medium">Data Type</label>
          <div class="flex gap-2">
            <button
              v-for="t in dataTypes"
              :key="t"
              class="rounded-full border px-3 py-1 text-xs font-medium transition"
              :class="
                dataType === t
                  ? 'border-accent bg-accent/20 text-accent'
                  : 'border-border text-text-secondary hover:border-accent'
              "
              @click="dataType = t"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <div class="mb-6">
          <label class="text-text-secondary mb-1 block text-xs font-medium">Format</label>
          <div class="flex gap-2">
            <button
              v-for="f in formats"
              :key="f"
              class="rounded-full border px-3 py-1 text-xs font-medium transition"
              :class="
                format === f
                  ? 'border-accent bg-accent/20 text-accent'
                  : 'border-border text-text-secondary hover:border-accent'
              "
              @click="format = f"
            >
              {{ f }}
            </button>
          </div>
        </div>

        <button
          class="bg-accent w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          @click="download"
        >
          Download
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', val: boolean): void }>()

const config = useRuntimeConfig()
const baseUrl = config.public.apiUrl

const dateRange = ref({ from: '', to: '' })
const dataTypes = ['Trends', 'Mentions', 'Predictions'] as const
const formats = ['CSV', 'JSON'] as const
const dataType = ref<(typeof dataTypes)[number]>('Trends')
const format = ref<(typeof formats)[number]>('CSV')

const endpointMap: Record<string, string> = {
  Trends: '/api/trends',
  Mentions: '/api/news',
  Predictions: '/api/predictions',
}

const download = async () => {
  const params: Record<string, string> = {}
  if (dateRange.value.from) params.from_date = dateRange.value.from
  if (dateRange.value.to) params.to_date = dateRange.value.to

  const data = await fetchWithHmac<Record<string, unknown>>(
    `${baseUrl}${endpointMap[dataType.value]}`,
    { params },
  )

  let content: string
  let mime: string
  const ext = format.value.toLowerCase()

  if (format.value === 'JSON') {
    content = JSON.stringify(data, null, 2)
    mime = 'application/json'
  } else {
    const items = (data.trends || data.news || data.predictions || []) as Record<string, unknown>[]
    if (!items.length) return
    const keys = Object.keys(items[0]!)
    const rows = items.map((item) => keys.map((k) => JSON.stringify(item[k] ?? '')).join(','))
    content = [keys.join(','), ...rows].join('\n')
    mime = 'text/csv'
  }

  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `trendbyte-${dataType.value.toLowerCase()}.${ext}`
  a.click()
  URL.revokeObjectURL(url)
  emit('update:modelValue', false)
}
</script>

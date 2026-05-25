<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      @click.self="emit('update:modelValue', false)"
    >
      <div class="glass-card border-border w-full max-w-lg border p-8 shadow-2xl">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-extrabold">Export Trends</h2>
          <button
            class="text-text-muted hover:text-text transition"
            @click="emit('update:modelValue', false)"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="mb-5">
          <label class="text-text-secondary mb-2 block text-sm font-medium">Date Range</label>
          <DateRangePicker v-model="dateRange" />
        </div>

        <div class="mb-5">
          <label class="text-text-secondary mb-2 block text-sm font-medium">Data Type</label>
          <div class="flex gap-2">
            <button
              v-for="t in dataTypes"
              :key="t"
              class="rounded-lg border px-4 py-2 text-sm font-medium transition"
              :class="
                dataType === t
                  ? 'border-accent bg-accent/20 text-accent'
                  : 'border-border text-text-secondary hover:border-accent hover:text-accent'
              "
              @click="dataType = t"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <div class="mb-8">
          <label class="text-text-secondary mb-2 block text-sm font-medium">Format</label>
          <div class="flex gap-2">
            <button
              v-for="f in formats"
              :key="f"
              class="rounded-lg border px-4 py-2 text-sm font-medium transition"
              :class="
                format === f
                  ? 'border-accent bg-accent/20 text-accent'
                  : 'border-border text-text-secondary hover:border-accent hover:text-accent'
              "
              @click="format = f"
            >
              {{ f }}
            </button>
          </div>
        </div>

        <button
          class="bg-accent w-full rounded-lg px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
          @click="download"
        >
          Download {{ dataType }} as {{ format }}
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

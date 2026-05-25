<template>
  <div>
    <h1 class="mb-2 text-3xl font-extrabold">Category Predictor</h1>
    <p class="text-text-secondary mb-6">Enter text to see which tech category it belongs to.</p>

    <div class="mb-6 max-w-lg">
      <textarea
        v-model="text"
        rows="4"
        placeholder="Enter text to classify..."
        class="border-border bg-surface text-text focus:border-accent w-full rounded-lg border px-4 py-3 text-sm outline-none"
      />
      <button
        class="bg-accent mt-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        :disabled="!text.trim() || loading"
        @click="predict"
      >
        Predict
      </button>
    </div>

    <div v-if="result" class="glass-card p-6">
      <div class="mb-4">
        <span class="bg-accent/20 text-accent rounded-full px-4 py-2 text-lg font-bold">
          {{ result.predicted }}
        </span>
      </div>
      <div v-if="result.breakdown?.length" class="space-y-2">
        <div v-for="b in result.breakdown" :key="b.category" class="flex items-center gap-3">
          <span class="text-text-secondary w-32 shrink-0 text-sm">{{ b.category }}</span>
          <div class="bg-surface-hover h-3 flex-1 overflow-hidden rounded-full">
            <div
              class="bg-accent h-full rounded-full transition-all"
              :style="{ width: `${b.confidence * 100}%` }"
            />
          </div>
          <span class="text-text-muted w-12 text-right text-xs">
            {{ (b.confidence * 100).toFixed(0) }}%
          </span>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="glass-card p-8 text-center">
      <p class="text-text-secondary">Enter text to see which tech category it belongs to.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Category Predictor — TrendByte' })

const config = useRuntimeConfig()
const baseUrl = config.public.apiUrl

const text = ref('')
const loading = ref(false)
const result = ref<{
  predicted: string
  breakdown: { category: string; confidence: number }[]
} | null>(null)

const predict = async () => {
  loading.value = true
  result.value = await fetchWithHmac<typeof result.value>(
    `${baseUrl}/api/categories/predict?text=${encodeURIComponent(text.value)}`,
  )
  loading.value = false
}
</script>

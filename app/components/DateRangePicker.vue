<template>
  <div class="relative" ref="container">
    <button
      class="border-border bg-surface text-text hover:border-accent flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition outline-none"
      @click="open = !open"
    >
      <svg class="h-4 w-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span v-if="modelValue.from || modelValue.to">
        {{ formatLabel(modelValue.from) }} — {{ formatLabel(modelValue.to) }}
      </span>
    </button>

    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:absolute md:inset-auto md:top-full md:right-0 md:mt-2 md:block md:bg-transparent md:p-0"
    >
      <div class="glass-card border-border w-full max-w-sm border p-4 shadow-lg md:w-72">
        <div class="mb-3 flex items-center justify-between">
          <button class="text-text-secondary hover:text-text text-sm" @click="prevMonth">←</button>
          <span class="text-sm font-semibold">{{ monthLabel }}</span>
          <button class="text-text-secondary hover:text-text text-sm" @click="nextMonth">→</button>
        </div>

        <div class="mb-1 grid grid-cols-7 text-center text-xs opacity-50">
          <span v-for="d in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="d">{{ d }}</span>
        </div>

        <div class="grid grid-cols-7 gap-0.5 text-center text-sm">
          <span v-for="_ in startDay" :key="'e' + _" />
          <button
            v-for="day in daysInMonth"
            :key="day"
            class="rounded px-1 py-1.5 transition"
            :class="dayClass(day)"
            @click="selectDay(day)"
          >
            {{ day }}
          </button>
        </div>

        <div class="mt-3 flex justify-between">
          <button class="text-text-secondary text-xs hover:underline" @click="clear">Clear</button>
          <button class="text-accent text-xs font-medium hover:underline" @click="open = false">
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: { from: string; to: string }
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: { from: string; to: string }): void
}>()

const open = ref(false)
const container = ref<HTMLElement>()
const viewDate = ref(new Date())
const selecting = ref<'from' | 'to'>('from')

const year = computed(() => viewDate.value.getFullYear())
const month = computed(() => viewDate.value.getMonth())
const monthLabel = computed(
  () => `${viewDate.value.toLocaleString('default', { month: 'long' })} ${year.value}`,
)
const daysInMonth = computed(() => new Date(year.value, month.value + 1, 0).getDate())
const startDay = computed(() => new Date(year.value, month.value, 1).getDay())

const prevMonth = () => {
  viewDate.value = new Date(year.value, month.value - 1, 1)
}
const nextMonth = () => {
  viewDate.value = new Date(year.value, month.value + 1, 1)
}

const toStr = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

const selectDay = (day: number) => {
  const date = toStr(year.value, month.value, day)
  if (selecting.value === 'from') {
    emit('update:modelValue', { from: date, to: '' })
    selecting.value = 'to'
  } else {
    const from = props.modelValue.from
    if (date < from) {
      emit('update:modelValue', { from: date, to: from })
    } else {
      emit('update:modelValue', { from, to: date })
    }
    selecting.value = 'from'
  }
}

const clear = () => {
  emit('update:modelValue', { from: '', to: '' })
  selecting.value = 'from'
}

const dayClass = (day: number) => {
  const date = toStr(year.value, month.value, day)
  const { from, to } = props.modelValue
  if (date === from || date === to) return 'bg-accent text-white'
  if (from && to && date > from && date < to) return 'bg-accent/20 text-accent'
  return 'hover:bg-surface-hover'
}

const formatLabel = (d: string) => {
  if (!d) return '...'
  const parts = d.split('-')
  const m = parts[1]
  const day = parts[2]
  return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m! - 1]} ${+day!}`
}

const onClickOutside = (e: MouseEvent) => {
  if (container.value && !container.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

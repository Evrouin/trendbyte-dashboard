<template>
  <img
    v-if="iconUrl"
    :src="iconUrl"
    :alt="name"
    :class="sizeClass"
    class="inline-block"
    loading="lazy"
    @error="onError"
  />
  <svg
    v-else
    :class="sizeClass"
    class="text-text-secondary inline-block"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
</template>

<script setup lang="ts">
import { getTechIconUrl } from '~/utils/techIcons'

const props = defineProps<{
  name: string
  size?: 'sm' | 'md' | 'lg'
}>()

const iconUrl = ref(getTechIconUrl(props.name))

const sizeClass = computed(() => {
  if (props.size === 'lg') return 'h-8 w-8'
  if (props.size === 'sm') return 'h-4 w-4'
  return 'h-5 w-5'
})

const onError = () => {
  iconUrl.value = null
}

watch(
  () => props.name,
  (n) => {
    iconUrl.value = getTechIconUrl(n)
  },
)
</script>

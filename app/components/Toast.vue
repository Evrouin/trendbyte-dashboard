<template>
  <Transition name="toast">
    <div
      v-if="message"
      class="border-accent/30 bg-bg-secondary text-text fixed right-6 bottom-6 z-50 rounded-lg border px-4 py-2.5 text-sm shadow-lg"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { message } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

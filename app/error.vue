<template>
  <div class="bg-bg flex min-h-screen items-center justify-center px-4">
    <div class="glass-card max-w-md p-8 text-center">
      <h1 class="text-text mb-4 text-4xl font-extrabold">
        {{ error?.statusCode === 404 ? '404' : 'Error' }}
      </h1>
      <p class="text-text-secondary mb-6">
        {{ error?.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
      </p>
      <NuxtLink v-if="error?.statusCode === 404" to="/" class="text-accent hover:underline">
        &larr; Back to home
      </NuxtLink>
      <button v-else class="text-accent hover:underline" @click="clearError({ redirect: '/' })">
        Retry
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const error = useError()
</script>

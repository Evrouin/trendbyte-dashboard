<template>
  <div class="min-h-screen">
    <nav class="border-b border-border px-6 py-4">
      <div class="mx-auto flex max-w-7xl items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold text-accent">TrendByte</NuxtLink>
        <div class="flex gap-6 text-sm text-muted">
          <NuxtLink to="/" class="hover:text-white">Overview</NuxtLink>
          <NuxtLink to="/trends" class="hover:text-white">Trends</NuxtLink>
          <NuxtLink to="/predictions" class="hover:text-white">Predictions</NuxtLink>
          <NuxtLink to="/categories" class="hover:text-white">Categories</NuxtLink>
        </div>
      </div>
    </nav>
    <main class="mx-auto max-w-7xl px-6 py-8">
      <slot />
    </main>
  </div>
</template>

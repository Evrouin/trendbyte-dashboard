<template>
  <div class="min-h-screen">
    <nav class="border-b border-border px-6 py-4">
      <div class="mx-auto flex max-w-7xl items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold tracking-widest text-accent uppercase">
          TrendByte
        </NuxtLink>
        <div class="flex gap-6 text-sm text-text-secondary">
          <NuxtLink to="/" class="transition hover:text-text">Overview</NuxtLink>
          <NuxtLink to="/trends" class="transition hover:text-text">Trends</NuxtLink>
          <NuxtLink to="/predictions" class="transition hover:text-text">Predictions</NuxtLink>
          <NuxtLink to="/categories" class="transition hover:text-text">Categories</NuxtLink>
        </div>
      </div>
    </nav>
    <main class="mx-auto max-w-7xl px-6 py-8">
      <slot />
    </main>
  </div>
</template>

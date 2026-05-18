<template>
  <div class="flex min-h-screen flex-col">
    <nav class="border-border border-b px-6 py-4">
      <div class="mx-auto flex max-w-7xl items-center justify-between">
        <NuxtLink
          to="/"
          class="text-accent flex items-center gap-1.5 text-xl font-bold tracking-widest uppercase"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" />
          </svg>
          TrendByte
        </NuxtLink>

        <button class="text-text-secondary md:hidden" @click="menuOpen = !menuOpen">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              v-if="!menuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div class="hidden gap-6 text-sm md:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="transition"
            :class="
              isActive(link.to)
                ? 'text-accent font-semibold'
                : 'text-text-secondary hover:text-text'
            "
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>

      <div v-if="menuOpen" class="mt-4 flex flex-col gap-3 text-sm md:hidden">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded px-2 py-1 transition"
          :class="
            isActive(link.to) ? 'text-accent bg-surface font-semibold' : 'text-text-secondary'
          "
          @click="menuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </nav>

    <main class="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
      <slot />
    </main>

    <footer class="border-border border-t px-6 py-6">
      <div
        class="text-text-muted mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs md:flex-row"
      >
        <span>TrendByte — Tech Trend Intelligence</span>
        <div class="flex gap-4">
          <a
            href="https://trendbyte.evrouin.com/docs"
            target="_blank"
            class="hover:text-accent transition"
            >API Docs</a
          >
          <a
            href="https://github.com/Evrouin/trendbyte"
            target="_blank"
            class="hover:text-accent transition"
            >GitHub</a
          >
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const menuOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Overview' },
  { to: '/news', label: 'News' },
  { to: '/trends', label: 'Trends' },
  { to: '/compare', label: 'Compare' },
  { to: '/predictions', label: 'Predictions' },
  { to: '/categories', label: 'Categories' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

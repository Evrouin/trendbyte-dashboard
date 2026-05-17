<template>
  <div class="min-h-screen flex flex-col">
    <nav class="border-b border-border px-6 py-4">
      <div class="mx-auto flex max-w-7xl items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold tracking-widest text-accent uppercase">
          TrendByte
        </NuxtLink>

        <button class="md:hidden text-text-secondary" @click="menuOpen = !menuOpen">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="hidden md:flex gap-6 text-sm">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="transition"
            :class="isActive(link.to) ? 'text-accent font-semibold' : 'text-text-secondary hover:text-text'"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>

      <div v-if="menuOpen" class="md:hidden mt-4 flex flex-col gap-3 text-sm">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="transition px-2 py-1 rounded"
          :class="isActive(link.to) ? 'text-accent font-semibold bg-surface' : 'text-text-secondary'"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </nav>

    <main class="mx-auto max-w-7xl w-full flex-1 px-6 py-8">
      <slot />
    </main>

    <footer class="border-t border-border px-6 py-6">
      <div class="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
        <span>TrendByte — Tech Trend Intelligence</span>
        <div class="flex gap-4">
          <a href="https://trendbyte.evrouin.com/docs" target="_blank" class="hover:text-accent transition">API Docs</a>
          <a href="https://github.com/Evrouin/trendbyte" target="_blank" class="hover:text-accent transition">GitHub</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const menuOpen = ref(false)

const navLinks = [
  { to: "/", label: "Overview" },
  { to: "/news", label: "News" },
  { to: "/trends", label: "Trends" },
  { to: "/predictions", label: "Predictions" },
  { to: "/categories", label: "Categories" },
]

const isActive = (path: string) => {
  if (path === "/") return route.path === "/"
  return route.path.startsWith(path)
}
</script>

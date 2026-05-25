<template>
  <div class="flex min-h-screen min-w-0 flex-col overflow-x-hidden">
    <nav class="border-border border-b px-6 py-4">
      <div class="mx-auto flex max-w-7xl items-center justify-between">
        <NuxtLink
          to="/"
          class="text-accent flex items-center gap-1.5 text-xl font-bold tracking-widest uppercase"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="6" fill="var(--color-bg-secondary)" />
            <rect
              x="4"
              y="4"
              width="24"
              height="24"
              rx="4"
              fill="rgba(56,139,253,0.06)"
              stroke="rgba(88,166,255,0.3)"
              stroke-width="1"
            />
            <path
              d="M8 22 L12 14 L16 18 L20 10 L24 12"
              stroke="#58a6ff"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
            <circle cx="24" cy="12" r="2" fill="#3fb950" />
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

        <div class="hidden items-center gap-6 text-sm md:flex">
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
          <div class="relative">
            <button
              class="flex items-center gap-1 transition"
              :class="
                isActive('/tools')
                  ? 'text-accent font-semibold'
                  : 'text-text-secondary hover:text-text'
              "
              @click="toolsOpen = !toolsOpen"
            >
              Tools
              <svg
                class="h-3 w-3 transition"
                :class="{ 'rotate-180': toolsOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              v-if="toolsOpen"
              class="glass-card border-border absolute top-full right-0 z-40 mt-2 w-48 border shadow-lg"
            >
              <template v-for="item in toolsItems" :key="item.label">
                <NuxtLink
                  v-if="!item.action"
                  :to="item.to"
                  class="block w-full px-4 py-2 text-left text-sm transition"
                  :class="
                    isActive(item.to)
                      ? 'text-accent bg-accent/10'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text'
                  "
                  @click="toolsOpen = false"
                >
                  {{ item.label }}
                </NuxtLink>
                <button
                  v-else
                  class="text-text-secondary hover:bg-surface-hover hover:text-text w-full px-4 py-2 text-left text-sm transition"
                  @click="handleToolClick(item)"
                >
                  {{ item.label }}
                </button>
              </template>
            </div>
          </div>
          <button
            class="text-text-secondary hover:text-accent transition"
            title="Toggle theme"
            @click="toggleTheme"
          >
            <svg
              v-if="isDark"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
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
        <span class="text-text-muted mt-2 px-2 text-xs font-semibold uppercase">Tools</span>
        <template v-for="item in toolsItems" :key="item.label">
          <NuxtLink
            v-if="!item.action"
            :to="item.to"
            class="rounded px-2 py-1 transition"
            :class="
              isActive(item.to) ? 'text-accent bg-surface font-semibold' : 'text-text-secondary'
            "
            @click="menuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
          <button
            v-else
            class="text-text-secondary rounded px-2 py-1 text-left transition"
            @click="handleToolClick(item)"
          >
            {{ item.label }}
          </button>
        </template>
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

    <ExportModal v-model="showExportModal" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const menuOpen = ref(false)
const toolsOpen = ref(false)
const showExportModal = ref(false)
const { isDark, toggle: toggleTheme, init: initTheme } = useTheme()
onMounted(() => initTheme())

const navLinks = [
  { to: '/', label: 'Overview' },
  { to: '/news', label: 'News' },
  { to: '/trends', label: 'Trends' },
  { to: '/predictions', label: 'Predictions' },
  { to: '/categories', label: 'Categories' },
]

const toolsItems = [
  { to: '/tools/lookup', label: 'Tech Lookup' },
  { to: '/tools/compare', label: 'Compare' },
  { to: '/tools/watchlist', label: 'Watchlist' },
  { to: '/tools/correlations', label: 'Correlation Finder' },
  { to: '/tools/predict', label: 'Category Predictor' },
  { to: '', label: 'Export Trends', action: true },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const handleToolClick = (item: (typeof toolsItems)[number]) => {
  if (item.action) {
    showExportModal.value = true
    toolsOpen.value = false
    menuOpen.value = false
  }
}
</script>

import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],

  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'https://trendbyte.evrouin.com',
      hmacSecret: process.env.NUXT_PUBLIC_HMAC_SECRET || '',
    },
  },

  app: {
    head: {
      title: 'TrendByte — Tech Trend Intelligence',
      meta: [
        {
          name: 'description',
          content:
            'Real-time tech trend intelligence dashboard. Track emerging technologies, compare frameworks, and predict the next big thing.',
        },
        { property: 'og:title', content: 'TrendByte — Tech Trend Intelligence' },
        {
          property: 'og:description',
          content:
            'Real-time tech trend intelligence dashboard. Track emerging technologies, compare frameworks, and predict the next big thing.',
        },
        { property: 'og:image', content: 'https://trendbytedashboard.evrouin.com/og.png' },
        { property: 'og:url', content: 'https://trendbytedashboard.evrouin.com' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://trendbytedashboard.evrouin.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  typescript: {
    strict: true,
  },
})

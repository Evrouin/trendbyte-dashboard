import { signRequest } from '~/utils/hmac'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl as string
  const secret = config.public.hmacSecret as string

  globalThis.$fetch = $fetch.create({
    async onRequest({ request, options }) {
      const url = typeof request === 'string' ? request : request.toString()
      if (!url.startsWith(apiUrl)) return

      const pathname = new URL(url).pathname
      const method = ((options.method as string) || 'GET').toUpperCase()
      const { signature, timestamp } = await signRequest(method, pathname, secret)

      options.headers.set('X-Signature', signature)
      options.headers.set('X-Timestamp', timestamp)
    },
  })
})

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
    onResponseError({ response }) {
      const status = response.status
      if (status === 429) console.warn('[API] Rate limited, please wait')
      else if (status === 401) console.warn('[API] Unauthorized request')
      else if (status >= 500) console.warn('[API] Server error, try again later')
    },
  })
})

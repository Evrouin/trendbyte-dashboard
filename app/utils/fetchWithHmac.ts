import type { FetchOptions } from 'ofetch'
import { signRequest } from './hmac'

export async function fetchWithHmac<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const config = useRuntimeConfig()
  const secret = config.public.hmacSecret as string
  const pathname = new URL(url, 'http://localhost').pathname
  const method = ((options.method as string) || 'GET').toUpperCase()

  const { signature, timestamp } = await signRequest(method, pathname, secret)

  return $fetch<T>(url, {
    ...options,
    headers: {
      ...(options.headers as Record<string, string>),
      'X-Signature': signature,
      'X-Timestamp': timestamp,
    },
  })
}

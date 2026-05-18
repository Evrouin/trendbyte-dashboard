import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTrendsStore } from '../app/stores/trends'

describe('useTrendsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with empty state', () => {
    const store = useTrendsStore()
    expect(store.trends).toEqual([])
    expect(store.stats).toBeNull()
    expect(store.predictions).toEqual([])
    expect(store.news).toEqual([])
  })

  it('isStale returns true when no data fetched', () => {
    const store = useTrendsStore()
    expect(store.isStale('trends-30-30')).toBe(true)
  })

  it('isStale returns false after fetch', () => {
    const store = useTrendsStore()
    store.lastFetched['test-key'] = Date.now()
    expect(store.isStale('test-key')).toBe(false)
  })

  it('isStale returns true after TTL expires', () => {
    const store = useTrendsStore()
    store.lastFetched['test-key'] = Date.now() - 6 * 60 * 1000
    expect(store.isStale('test-key')).toBe(true)
  })

  it('invalidate clears all timestamps', () => {
    const store = useTrendsStore()
    store.lastFetched = { a: Date.now(), b: Date.now() }
    store.invalidate()
    expect(store.lastFetched).toEqual({})
  })
})

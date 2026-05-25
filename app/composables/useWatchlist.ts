export function useWatchlist() {
  const KEY = 'trendbyte-watchlist'
  const list = ref<string[]>([])

  if (import.meta.client) {
    list.value = JSON.parse(localStorage.getItem(KEY) || '[]')
  }

  const persist = () => localStorage.setItem(KEY, JSON.stringify(list.value))

  const add = (name: string) => {
    if (!list.value.includes(name)) {
      list.value.push(name)
      persist()
    }
  }

  const remove = (name: string) => {
    list.value = list.value.filter((n) => n !== name)
    persist()
  }

  const has = (name: string) => list.value.includes(name)

  return { list, add, remove, has }
}

export const trendPath = (name: string): string => {
  return `/trends/${encodeURIComponent(name)}`
}

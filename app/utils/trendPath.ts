export const trendPath = (name: string): string => {
  const slug = name
    .replace(/\+\+/g, 'plusplus')
    .replace(/#/g, 'sharp')
    .replace(/\./g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase()
  return `/trends/${slug}`
}

export const decodeTrendName = (slug: string): string => {
  return slug
}

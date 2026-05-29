export default defineEventHandler(() => {
  const baseUrl = 'https://trendbytedashboard.evrouin.com'
  const pages = [
    '/',
    '/trends',
    '/news',
    '/predictions',
    '/categories',
    '/tools/lookup',
    '/tools/compare',
    '/tools/watchlist',
  ]
  const urls = pages.map((p) => `  <url><loc>${baseUrl}${p}</loc></url>`).join('\n')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  )
})

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

const TITLE = 'Voonna Gowri Ganesh — AI Developer'
const DESCRIPTION =
  'Voonna Gowri Ganesh — AI Developer building intelligent, production-ready products across AI, full-stack engineering and system design.'

/**
 * Social/SEO tags. Link scrapers need absolute URLs, but this site's final
 * domain isn't fixed yet, so set VITE_SITE_URL at build time. Without it the
 * tags fall back to relative paths and the canonical link is omitted rather
 * than pointing at a wrong domain.
 */
function socialMeta(siteUrl: string): Plugin {
  const base = siteUrl.replace(/\/+$/, '')
  const abs = (path: string) => `${base}${path}`
  const tags = [
    base ? `<link rel="canonical" href="${abs('/')}" />` : '',
    `<meta property="og:type" content="website" />`,
    base ? `<meta property="og:url" content="${abs('/')}" />` : '',
    `<meta property="og:title" content="${TITLE}" />`,
    `<meta property="og:description" content="${DESCRIPTION}" />`,
    `<meta property="og:image" content="${abs('/og-image.jpg')}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Voonna Gowri Ganesh — AI Developer at Techgene Solutions" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${TITLE}" />`,
    `<meta name="twitter:description" content="${DESCRIPTION}" />`,
    `<meta name="twitter:image" content="${abs('/og-image.jpg')}" />`,
  ].filter(Boolean)
  return {
    name: 'social-meta',
    transformIndexHtml: (html) => html.replace('</title>', `</title>\n    ${tags.join('\n    ')}`),
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), socialMeta(env.VITE_SITE_URL ?? '')],
  }
})

import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Revival Video',
    short_name: 'Revival Video',
    description: 'Be Kind, Revive.',
    start_url: '/',
    display: 'standalone',
    background_color: '#20121e',
    theme_color: '#20121e',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
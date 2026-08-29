import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // No includeAssets: globPatterns below already matches svg/png/webmanifest,
      // and listing them twice just duplicates precache entries.
      manifest: {
        name: 'Harshit Chauhan — Portfolio',
        short_name: 'Harshit',
        description:
          "Every project starts with curiosity. This is where I share what I build, what I learn, and what's next.",
        // The intro at "/" is the branded front door and is near-black, so the
        // splash colours below match it rather than the light inner pages.
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#11110F',
        theme_color: '#11110F',
        icons: [
          {src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
          {src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
          {src: '/icons/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
        ],
        shortcuts: [
          {name: 'Overview', url: '/overview', icons: [{src: '/icons/pwa-192.png', sizes: '192x192'}]},
          {name: 'Websites', url: '/websites', icons: [{src: '/icons/pwa-192.png', sizes: '192x192'}]},
          {name: 'Fun Code', url: '/fun-code', icons: [{src: '/icons/pwa-192.png', sizes: '192x192'}]},
          {name: 'Posters', url: '/posters', icons: [{src: '/icons/pwa-192.png', sizes: '192x192'}]},
        ],
      },
      workbox: {
        // Precache the whole shell: every route chunk included. That is what
        // stops an offline CurtainLink from stalling on a missing import.
        globPatterns: ['**/*.{js,css,html,svg,woff2,png,webmanifest}'],
        // BrowserRouter means /websites etc. are real paths — without this,
        // deep links 404 offline.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/\.well-known\//, /\.pdf$/, /\.mp4$/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Content photography: too heavy to precache, worth keeping once seen.
            urlPattern: ({url}) => url.pathname.startsWith('/images/') && url.pathname.endsWith('.webp'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30},
              cacheableResponse: {statuses: [0, 200]},
            },
          },
          {
            urlPattern: ({url}) => url.pathname === '/resume.pdf',
            handler: 'CacheFirst',
            options: {
              cacheName: 'documents',
              expiration: {maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 30},
              cacheableResponse: {statuses: [0, 200]},
            },
          },
          {
            // The only runtime API call in the app. Falls back to the cached
            // response offline; the component also keeps its own stale copy.
            urlPattern: ({url}) => url.hostname === 'github-contributions-api.jogruber.de',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'github-contributions',
              networkTimeoutSeconds: 5,
              expiration: {maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 7},
              cacheableResponse: {statuses: [0, 200]},
            },
          },
        ],
        // lbt_vid.mp4 (1.4 MB) is deliberately absent: it is preload="none"
        // behind a LazyMount, and ranged media through a SW is a known problem.
      },
      devOptions: {enabled: false},
    }),
  ],
});

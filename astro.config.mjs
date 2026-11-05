// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.duettoestudio.com.br',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  build: { format: 'directory' },
  image: {
    // Imagens provisórias são servidas pelo CDN do Unsplash; ver src/lib/img.ts
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
});

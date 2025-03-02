// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    optimizeDeps: {
      include: ['three', '@react-three/fiber', '@react-three/drei', 'gsap'],
    },
    ssr: {
      noExternal: ['gsap']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/styles/Common.scss";
            @use "@/styles/Global.scss";
          `,
          quietDeps: true,
        }
      }
    }
  },
});

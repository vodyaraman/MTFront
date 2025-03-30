// @ts-check
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import swup from '@swup/astro';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcPath = path.resolve(__dirname, 'src');

export default defineConfig({
  integrations: [react(), swup()],
  vite: {
    resolve: {
      alias: {
        '@': srcPath,
      },
    },
    optimizeDeps: {
      include: ['three', '@react-three/fiber', '@react-three/drei', 'gsap'],
    },
    ssr: {
      noExternal: ['gsap'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [srcPath],
          additionalData: `
            @use "@/styles/Common.scss" as *;
            @use "@/styles/Global.scss";
            @use "@/styles/Variables.scss" as *;
            @use "@/styles/Elements.scss" as *;
          `,
          quietDeps: true,
        },
      },
    }    
  },
});

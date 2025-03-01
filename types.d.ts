/// <reference types="astro/client" />
import { ThreeElements } from '@react-three/fiber'

declare global {
  namespace React {
    namespace JSX {
        interface IntrinsicElements extends ThreeElements {
        }
    }
  }
}

declare global {
  interface Window {
    __lenis?: import('@studio-freight/lenis').default;
  }
}

export {};

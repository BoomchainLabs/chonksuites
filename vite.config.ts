// vite.config.ts
import { defineConfig } from 'vite';

export default async function () {
  const cartographer = await import('@replit/vite-plugin-cartographer').then(m => m.default());

  return defineConfig({
    plugins: [cartographer],
    build: {
      target: 'esnext'
    }
  });
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression'
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    compression({ algorithm: 'gzip', ext: '.gz' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          const parts = id.split('node_modules/')[1];
          if (!parts) return 'vendor';

          const pkg = parts.startsWith('@')
            ? parts.split('/').slice(0, 2).join('/')
            : parts.split('/')[0];

          const reactPackages = new Set([
            'react',
            'react-dom',
            'react-router-dom',
            'react-icons',
            'react-easy-crop',
            'react-chartjs-2',
            'recharts',
            '@tanstack/react-query',
            'lucide-react',
            'framer-motion'
          ]);

          if (reactPackages.has(pkg) || pkg.startsWith('@radix-ui')) return 'vendor-react';
          if (pkg === 'three') return 'vendor-three';
          if (pkg === 'chart.js') return 'vendor-charts';

          return;
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})

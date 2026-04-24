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
    // Enable file hashing for all assets to bust cache on updates
    assetsDir: 'assets',
    // Add hash to all file types
    rollupOptions: {
      output: {
        // Hash files to ensure cache busting on updates
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|gif|svg|webp|woff|woff2|eot|ttf|otf/.test(ext)) {
            return `assets/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
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

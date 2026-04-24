import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import './i18n'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App/>
    </QueryClientProvider>
  </StrictMode>,
)

// Service Worker Registration with cache invalidation
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(registration => {
      // Check for updates every 6 hours
      setInterval(() => {
        registration.update().catch(err => {
          console.warn('Service worker update check failed:', err);
        });
      }, 6 * 60 * 60 * 1000);
      
      // Listen for controller changes (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.info('New service worker activated, reloading page...');
        window.location.reload();
      });
    }).catch((error) => {
      console.warn('Service worker registration failed:', error);
    });
  });
}

// Prevent aggressive caching in the browser
if ('caches' in window) {
  // Clear old caches periodically
  caches.keys().then(cacheNames => {
    const currentVersion = 'v1';
    cacheNames.forEach(cacheName => {
      if (!cacheName.includes(currentVersion)) {
        caches.delete(cacheName);
      }
    });
  });
}

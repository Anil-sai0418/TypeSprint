import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import './i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes fresh cache
      gcTime: 15 * 60 * 1000, // Keep in memory for 15 minutes
      refetchOnWindowFocus: false, // Prevent aggressive focus refetches
      retry: 1
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App/>
    </QueryClientProvider>
  </StrictMode>,
)

// Service Worker Registration with cache invalidation
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(registration => {
        setInterval(() => {
          registration.update().catch(err => {
            console.warn('Service worker update check failed:', err);
          });
        }, 6 * 60 * 60 * 1000);
        
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.info('New service worker activated, reloading page...');
          window.location.reload();
        });
      }).catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
    });
  } else {
    // Unregister legacy service workers in dev mode to prevent network locks
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      let unregisteredAny = false;
      for (const registration of registrations) {
        registration.unregister();
        unregisteredAny = true;
      }
      if (unregisteredAny && !sessionStorage.getItem('sw_cleared_dev')) {
        sessionStorage.setItem('sw_cleared_dev', 'true');
        window.location.reload();
      }
    });
  }
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

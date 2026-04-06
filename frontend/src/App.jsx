import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './context/ThemeContext'
import NetworkProvider from './context/NetworkContext'
import { NotificationProvider } from './context/NotificationContext'
import { AuthProvider } from './context/useAuth'
import { OfflineScreen, NetworkStatusBanner, ReconnectedToast } from './components/NetworkStatus'
import { useNetworkStatus } from './context/useNetworkStatus'
import routes from './router/routes'
import NotificationTracker from './components/notification/NotificationTracker'
import SEO from './components/SEO'
import { Toaster } from './components/ui/sonner'
import PushNotificationSetup from './components/notification/PushNotificationSetup'
import { useTheme } from './context/useTheme'

function ThemeAwareToaster() {
  const { theme } = useTheme();
  
  return (
    <Toaster 
      position="top-right" 
      theme={theme}
      style={{ top: '70px' }}
      toastOptions={{
        classNames: {
          // Base premium toast styles with glassmorphism
          toast: "group toast group-[.toaster]:bg-white/70 dark:group-[.toaster]:bg-zinc-950/70 group-[.toaster]:text-zinc-950 dark:group-[.toaster]:text-zinc-50 group-[.toaster]:border-zinc-200/50 dark:group-[.toaster]:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] backdrop-blur-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-all font-sans",
          description: "group-[.toast]:text-zinc-500 dark:group-[.toast]:text-zinc-400 font-medium",
          actionButton: "group-[.toast]:bg-zinc-900 dark:group-[.toast]:bg-zinc-50 group-[.toast]:text-zinc-50 dark:group-[.toast]:text-zinc-900 font-semibold rounded-lg shadow-sm hover:scale-105 transition-transform",
          cancelButton: "group-[.toast]:bg-zinc-100 dark:group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-500 dark:group-[.toast]:text-zinc-400 font-semibold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors",
          
          // Semantic color overrides matching the elegant theme (subtle colored glass)
          error: "group-[.toaster]:bg-red-50/80 dark:group-[.toaster]:bg-red-950/40 group-[.toaster]:text-red-700 dark:group-[.toaster]:text-red-400 group-[.toaster]:border-red-200 dark:group-[.toaster]:border-red-900/50",
          success: "group-[.toaster]:bg-emerald-50/80 dark:group-[.toaster]:bg-emerald-950/40 group-[.toaster]:text-emerald-700 dark:group-[.toaster]:text-emerald-400 group-[.toaster]:border-emerald-200 dark:group-[.toaster]:border-emerald-900/50",
          warning: "group-[.toaster]:bg-amber-50/80 dark:group-[.toaster]:bg-amber-950/40 group-[.toaster]:text-amber-700 dark:group-[.toaster]:text-amber-400 group-[.toaster]:border-amber-200 dark:group-[.toaster]:border-amber-900/50",
          info: "group-[.toaster]:bg-blue-50/80 dark:group-[.toaster]:bg-blue-950/40 group-[.toaster]:text-blue-700 dark:group-[.toaster]:text-blue-400 group-[.toaster]:border-blue-200 dark:group-[.toaster]:border-blue-900/50",
          
          // Icon styles to blend with the text colors
          icon: "group-data-[type=error]:text-red-600 dark:group-data-[type=error]:text-red-400 group-data-[type=success]:text-emerald-600 dark:group-data-[type=success]:text-emerald-400 group-data-[type=warning]:text-amber-600 dark:group-data-[type=warning]:text-amber-400 group-data-[type=info]:text-blue-600 dark:group-data-[type=info]:text-blue-400",
        }
      }}
    />
  );
}

function AppContent() {
  const { isConnected } = useNetworkStatus();

  return (
    <>
      <PushNotificationSetup />
      {/* Show full-page offline screen when offline */}
      {!isConnected && <OfflineScreen />}

      {/* Network status banner (slow/reconnecting) */}
      <NetworkStatusBanner />

      {/* Reconnected toast notification */}
      <ReconnectedToast />

      {/* App content */}
      {isConnected && (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <SEO />
          <NotificationTracker />
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}

import { TooltipProvider } from './components/ui/tooltip'

function App() {
  return (
    <NetworkProvider>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <TooltipProvider>
              <AppContent />
              <ThemeAwareToaster />
            </TooltipProvider>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </NetworkProvider>
  )
}

export default App

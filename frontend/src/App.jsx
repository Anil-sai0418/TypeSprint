import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './context/ThemeContext'
import NetworkProvider from './context/NetworkContext'
import { NotificationProvider } from './context/NotificationContext'
import { OfflineScreen, NetworkStatusBanner, ReconnectedToast } from './components/NetworkStatus'
import { useNetworkStatus } from './context/useNetworkStatus'
import routes from './router/routes'

function AppContent() {
  const { isConnected } = useNetworkStatus();

  return (
    <>
      {/* Show full-page offline screen when offline */}
      {!isConnected && <OfflineScreen />}

      {/* Network status banner (slow/reconnecting) */}
      <NetworkStatusBanner />

      {/* Reconnected toast notification */}
      <ReconnectedToast />

      {/* App content */}
      {isConnected && (
        <BrowserRouter>
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

function App() {
  return (
    <NetworkProvider>
      <ThemeProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </ThemeProvider>
    </NetworkProvider>
  )
}

export default App

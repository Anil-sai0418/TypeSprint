import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './context/ThemeContext'
import routes from './router/routes'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

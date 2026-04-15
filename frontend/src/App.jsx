import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Book from './pages/Book'
import Desk from './pages/Desk'

// GA4 page view tracker
function PageTracker() {
  const location = useLocation()
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
      })
    }
  }, [location])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <PageTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Book />} />
        <Route path="/Desk" element={<Desk />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-center px-4">
      <p className="text-7xl font-display font-bold text-brand-700 mb-4">404</p>
      <h1 className="text-2xl font-display text-ink mb-2">Page not found</h1>
      <p className="text-ink-muted mb-8 font-body">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  )
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

/** Stop browser restoring old scroll (e.g. footer) after refresh — start at top / hero. */
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)
  window.addEventListener(
    'pageshow',
    (event) => {
      if (event.persisted) {
        window.scrollTo(0, 0)
      }
    },
    { passive: true },
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
